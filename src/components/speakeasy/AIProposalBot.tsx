"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { getProposalFeedback } from "./ProposalBot";

interface AIProposalBotProps {
  title: string;
  abstract: string;
  track: string;
  onTitleSuggestion?: (title: string) => void;
  onAbstractImprovement?: (abstract: string) => void;
}

export default function AIProposalBot({ 
  title, 
  abstract, 
  track,
  onTitleSuggestion,
  onAbstractImprovement
}: AIProposalBotProps) {
  const [loading, setLoading] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [generatingTitles, setGeneratingTitles] = useState(false);
  const [improvingAbstract, setImprovingAbstract] = useState(false);

  const localFeedback = getProposalFeedback(title, abstract, track);

  const handleAIEnhance = async () => {
    if (!title && !abstract) {
      toast.error("Enter at least a title or abstract first");
      return;
    }

    setLoading(true);
    setAiMode(true);
    
    try {
      const response = await fetch('/api/ai/proposal-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, abstract, track }),
      });

      if (!response.ok) {
        throw new Error('AI enhancement failed');
      }

      const data = await response.json();
      setAiFeedback(data);
      toast.success("AI feedback generated!");
    } catch (error) {
      console.error(error);
      toast.error("AI features require OpenAI API key");
      setAiMode(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTitles = async () => {
    if (!abstract) {
      toast.error("Enter an abstract first to generate titles");
      return;
    }

    setGeneratingTitles(true);
    
    try {
      const response = await fetch('/api/ai/generate-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abstract, track }),
      });

      if (!response.ok) {
        throw new Error('Title generation failed');
      }

      const data = await response.json();
      
      // Show titles in a toast with option to use them
      const titlesText = data.titles.map((t: string, i: number) => `${i + 1}. ${t}`).join('\n');
      toast.success(`AI-Generated Titles:\n\n${titlesText}`, { duration: 10000 });
      
      // Auto-apply first suggestion if callback provided
      if (onTitleSuggestion && data.titles[0]) {
        onTitleSuggestion(data.titles[0]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate titles");
    } finally {
      setGeneratingTitles(false);
    }
  };

  const handleImproveAbstract = async () => {
    if (!abstract) {
      toast.error("Enter an abstract first");
      return;
    }

    setImprovingAbstract(true);
    
    try {
      const response = await fetch('/api/ai/improve-abstract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abstract, track }),
      });

      if (!response.ok) {
        throw new Error('Abstract improvement failed');
      }

      const data = await response.json();
      
      if (onAbstractImprovement && data.improved) {
        onAbstractImprovement(data.improved);
        toast.success("Abstract improved by AI!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to improve abstract");
    } finally {
      setImprovingAbstract(false);
    }
  };

  const displayFeedback = aiMode && aiFeedback ? aiFeedback : localFeedback;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              {aiMode ? "AI ProposalBot" : "ProposalBot feedback"}
            </CardTitle>
            <CardDescription>
              {aiMode ? "Powered by AI" : "Rules-based tips"}
            </CardDescription>
          </div>
          {!aiMode && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAIEnhance}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-4" />
                  AI Enhance
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Score</div>
          <div className="text-3xl font-semibold">{displayFeedback.score}/100</div>
        </div>

        <div className="text-sm space-y-2">
          <div className="font-medium">Strengths</div>
          <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
            {displayFeedback.strengths?.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="text-sm space-y-2">
          <div className="font-medium">Suggestions</div>
          <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
            {displayFeedback.suggestions?.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        {aiMode && aiFeedback && (
          <>
            {aiFeedback.improved_title && (
              <div className="text-sm space-y-2 pt-2 border-t">
                <div className="font-medium">AI Suggested Title</div>
                <div className="p-2 bg-secondary rounded text-sm">
                  {aiFeedback.improved_title}
                </div>
                {onTitleSuggestion && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onTitleSuggestion(aiFeedback.improved_title)}
                  >
                    Use This Title
                  </Button>
                )}
              </div>
            )}
            {aiFeedback.improved_abstract && (
              <div className="text-sm space-y-2 pt-2 border-t">
                <div className="font-medium">AI Suggested Abstract</div>
                <div className="p-2 bg-secondary rounded text-sm whitespace-pre-wrap">
                  {aiFeedback.improved_abstract}
                </div>
                {onAbstractImprovement && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onAbstractImprovement(aiFeedback.improved_abstract)}
                  >
                    Use This Abstract
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        <div className="pt-2 border-t space-y-2">
          <div className="text-sm font-medium">AI Tools</div>
          <div className="flex flex-col gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleGenerateTitles}
              disabled={generatingTitles || !abstract}
            >
              {generatingTitles ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 size-4" />
                  Generate Title Ideas
                </>
              )}
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleImproveAbstract}
              disabled={improvingAbstract || !abstract}
            >
              {improvingAbstract ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 size-4" />
                  Improve Abstract
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}