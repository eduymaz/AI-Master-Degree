"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { RetrievedChunk } from "@/lib/types";
import { BookOpen } from "lucide-react";

export function SourceCitations({ chunks }: { chunks: RetrievedChunk[] }) {
  if (chunks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-accent" />
          <CardTitle>Kaynak Referansları</CardTitle>
        </div>
        <CardDescription>
          Hibrit retrieval ile bilgi tabanından getirilen {chunks.length} chunk
          (semantik + BM25, Reciprocal Rank Fusion).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 pr-3">
          <div className="space-y-3">
            {chunks.map((c, idx) => (
              <div key={c.chunk_id}>
                <article className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
                          {c.chunk_id}
                        </code>
                        <Badge variant="outline" className="text-[10px]">
                          {c.jurisdiction}
                        </Badge>
                      </div>
                      <h5 className="font-serif text-sm font-medium">{c.title}</h5>
                      <p className="text-[11px] text-muted-foreground">{c.authority}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 text-[10px] text-muted-foreground">
                      <span>cos: {c.similarity_score.toFixed(2)}</span>
                      <span>bm25: {c.bm25_score.toFixed(2)}</span>
                      <span className="font-semibold text-accent">
                        rrf: {c.fused_score.toFixed(3)}
                      </span>
                    </div>
                  </div>
                  <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    {c.text}
                  </p>
                </article>
                {idx < chunks.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
