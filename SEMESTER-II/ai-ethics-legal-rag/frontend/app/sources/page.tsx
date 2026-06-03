import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradientMesh } from "@/components/gradient-mesh";
import { api } from "@/lib/api";
import { SAMPLE_SOURCES } from "@/lib/sample-sources-rules";
import { BookOpen, ExternalLink, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  let sources: typeof SAMPLE_SOURCES = SAMPLE_SOURCES;
  let isLive = false;
  try {
    const res = await api.listSources();
    if (res?.sources?.length) {
      sources = res.sources;
      isLive = true;
    }
  } catch {
    /* fallback to sample */
  }

  const groups = sources.reduce<Record<string, typeof sources>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  const labels: Record<string, string> = {
    primary_regulation: "Birincil Düzenleyici Belgeler",
    international_standard: "Uluslararası Standartlar",
    international_recommendation: "Uluslararası Tavsiyeler",
    international_guidance: "Uluslararası Rehberler",
    national_law: "Ulusal Yasalar",
    academic_synthesis: "Akademik Sentez",
  };

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-border/40">
        <GradientMesh variant="subtle" />
        <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16">
          <Badge variant="outline" className="mb-3 bg-card/60 backdrop-blur-md">
            <BookOpen className="mr-1 size-3 text-accent" />
            Bilgi Tabanı
          </Badge>
          <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            Hibrit retrieval ile{" "}
            <span className="bg-gradient-to-br from-bakircay-600 to-bakircay-500 bg-clip-text text-transparent">
              sorgulanan kaynaklar
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            {sources.length} küratörlü belge — semantik embedding (multilingual-e5-large) + BM25
            lexical retrieval + Reciprocal Rank Fusion ile sorgulanır. ChromaDB persistent
            collection: <code className="font-mono text-xs">yz-etik-saglik</code>
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="accent" className="gap-1">
              <span className={`size-1.5 rounded-full ${isLive ? "bg-success" : "bg-warning"}`} />
              {isLive ? "Canlı bilgi tabanı" : "Örnek veri (backend kapalı)"}
            </Badge>
            <Badge variant="outline">{sources.length} belge</Badge>
            <Badge variant="outline">4 yargı bölgesi</Badge>
          </div>
        </div>
      </section>

      {Object.entries(groups).map(([category, items]) => (
        <section key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-accent" />
            <h2 className="font-serif text-xl font-semibold tracking-tight">
              {labels[category] ?? category}
            </h2>
            <span className="text-sm text-muted-foreground">· {items.length}</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((s) => (
              <Card
                key={s.doc_id}
                className="group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-bakircay-500/5 blur-2xl transition-opacity group-hover:opacity-100" />
                <CardHeader className="relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <BookOpen className="size-4" />
                      </div>
                      <CardTitle className="text-base leading-tight">{s.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      {s.jurisdiction}
                    </Badge>
                  </div>
                  <CardDescription className="ml-11 space-y-0.5">
                    <span className="block">{s.authority}</span>
                    <span className="block text-xs">{s.publication_date}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative ml-11 space-y-3">
                  <code className="block w-fit rounded bg-secondary px-2 py-1 font-mono text-[10px] text-muted-foreground">
                    {s.doc_id}
                  </code>
                  {s.source_url && (
                    <a
                      href={s.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                    >
                      Kaynağı görüntüle <ExternalLink className="size-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
