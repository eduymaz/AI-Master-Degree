"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { SAMPLE_PRESETS, SAMPLE_RESULTS } from "@/lib/sample-data";
import type {
  EvaluationRequest,
  HealthcareArea,
  LLMProvider,
  PresetUseCaseEntry,
  UseCase,
} from "@/lib/types";
import { Loader2, Sparkles, Wand2 } from "lucide-react";

interface Props {
  onSubmit: (req: EvaluationRequest) => Promise<void> | void;
  isLoading: boolean;
}

const AREAS: { value: HealthcareArea; label: string }[] = [
  { value: "radiology", label: "Radyoloji / Görüntüleme" },
  { value: "clinical_decision_support", label: "Klinik Karar Destek" },
  { value: "data_governance", label: "Veri Yönetişimi" },
  { value: "drug_discovery", label: "İlaç Keşfi" },
  { value: "patient_facing", label: "Hasta-Yüzlü Sistemler" },
  { value: "other", label: "Diğer" },
];

export function UseCaseForm({ onSubmit, isLoading }: Props) {
  const [presets, setPresets] = useState<PresetUseCaseEntry[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");
  const [form, setForm] = useState<UseCase>({
    title: "",
    area: "radiology",
    description: "",
    data_sources: [],
    affected_stakeholders: [],
    jurisdiction: ["EU", "TR"],
  });
  // Varsayılan: Groq (ücretsiz Llama 3.3 70B, çok hızlı, cloud-hosted)
  const [llmProvider, setLlmProvider] = useState<LLMProvider>("groq");
  const [rulesEnabled, setRulesEnabled] = useState(true);

  useEffect(() => {
    // Backend varsa canlı, yoksa örnek şablonlara fallback
    api
      .listUseCases()
      .then((r) => setPresets(r.use_cases?.length ? r.use_cases : SAMPLE_PRESETS))
      .catch(() => setPresets(SAMPLE_PRESETS));
  }, []);

  const loadPreset = async (id: string) => {
    setSelectedPreset(id);
    if (id === "custom") {
      setForm({
        title: "",
        area: "radiology",
        description: "",
        data_sources: [],
        affected_stakeholders: [],
        jurisdiction: ["EU", "TR"],
      });
      return;
    }
    // Önce backend; başarısızsa örnek veri
    try {
      const uc = await api.getUseCase(id);
      setForm(uc);
      return;
    } catch {
      // fallthrough
    }
    // Örnek veri'den oluştur
    const sample = SAMPLE_RESULTS[id];
    if (sample) {
      const preset = SAMPLE_PRESETS.find((p) => p.id === id);
      setForm({
        title: preset?.title ?? "",
        area: (preset?.area as HealthcareArea) ?? "radiology",
        description: sample.use_case_summary ?? "",
        data_sources: [],
        affected_stakeholders: [],
        jurisdiction: preset?.jurisdiction ?? ["EU", "TR"],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title.length < 10 || form.description.length < 50) {
      return;
    }
    await onSubmit({
      use_case: form,
      llm_provider: llmProvider,
      rules_enabled: rulesEnabled,
      include_narrative: true,
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="size-4 text-accent" />
          <CardTitle>Use Case Tanımı</CardTitle>
        </div>
        <CardDescription>
          Bir sağlık YZ uygulamasını tanımlayın; sistem etik ve hukuki açıdan değerlendirir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hazır use case seçici */}
          <div className="space-y-2">
            <Label htmlFor="preset">Hazır Şablon</Label>
            <Select value={selectedPreset} onValueChange={loadPreset}>
              <SelectTrigger id="preset">
                <SelectValue placeholder="Bir şablon seç veya boş bırak" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Boş başla</SelectItem>
                {presets.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              A raporundaki üç use case hazır şablon olarak yüklenebilir.
            </p>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                placeholder="Örn. Radyolojide YZ destekli akciğer tanısı"
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                required
                minLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Alan</Label>
              <Select
                value={form.area}
                onValueChange={(v) => setForm((s) => ({ ...s, area: v as HealthcareArea }))}
              >
                <SelectTrigger id="area">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AREAS.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jurisdiction">Yargı Bölgeleri</Label>
              <Input
                id="jurisdiction"
                placeholder="EU, TR, US, IT"
                value={(form.jurisdiction ?? []).join(", ")}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    jurisdiction: e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detaylı Açıklama</Label>
            <Textarea
              id="description"
              placeholder="Sistem ne yapar? Hangi verileri kullanır? Kararı kim etkiler? Hangi etik/hukuki çerçeveler dahildir?"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              required
              minLength={50}
              rows={8}
              className="font-serif leading-relaxed"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {form.description.length} karakter
                {form.description.length < 200 && " — daha fazla detay önerilir (≥200)"}
              </span>
              <Badge variant="outline" className="text-[10px]">
                serif okunabilirlik
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="data">Veri Kaynakları (virgülle)</Label>
              <Input
                id="data"
                placeholder="MIMIC-CXR, e-Nabız, federated"
                value={(form.data_sources ?? []).join(", ")}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    data_sources: e.target.value.split(",").map((x) => x.trim()).filter(Boolean),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stake">Etkilenen Paydaşlar (virgülle)</Label>
              <Input
                id="stake"
                placeholder="radyolog, hasta, hastane, sigorta"
                value={(form.affected_stakeholders ?? []).join(", ")}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    affected_stakeholders: e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="llm">LLM Sağlayıcı</Label>
              <Select value={llmProvider} onValueChange={(v) => setLlmProvider(v as LLMProvider)}>
                <SelectTrigger id="llm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="groq">Groq · Llama 3.3 70B (ücretsiz · hızlı)</SelectItem>
                  <SelectItem value="claude">Claude (Anthropic API — anahtar gerekir)</SelectItem>
                  <SelectItem value="ollama">Ollama · Llama 3.2 (yerel kurulum)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-md border bg-muted/30 px-4 md:col-span-2">
              <div className="space-y-0.5">
                <Label htmlFor="rules" className="cursor-pointer">
                  Kural Motoru
                </Label>
                <p className="text-xs text-muted-foreground">
                  24 kuralı uygula (ablation için kapatılabilir)
                </p>
              </div>
              <Switch id="rules" checked={rulesEnabled} onCheckedChange={setRulesEnabled} />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            variant="default"
            disabled={isLoading || form.title.length < 10 || form.description.length < 50}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Değerlendiriliyor...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Etik & Hukuki Değerlendirme Üret
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
