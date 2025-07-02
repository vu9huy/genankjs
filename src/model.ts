import type { ModelConfig, Field, Template } from './types.js';
import { generateModelId, ankiTime } from './utils.js';

export class Model {
  public modelId: number;
  public name: string;
  public fields: Field[];
  public templates: Template[];
  public css: string;
  public latexPre: string;
  public latexPost: string;
  public type: number;
  public tags: string[];

  constructor(config: ModelConfig) {
    this.modelId = config.modelId ?? generateModelId();
    this.name = config.name;
    this.fields = this.processFields(config.fields);
    this.templates = this.processTemplates(config.templates);
    this.css = config.css ?? this.getDefaultCss();
    this.latexPre = config.latexPre ?? this.getDefaultLatexPre();
    this.latexPost = config.latexPost ?? this.getDefaultLatexPost();
    this.type = config.type ?? 0; // 0 = standard, 1 = cloze
    this.tags = config.tags ?? [];
  }

  private processFields(fields: Field[]): Field[] {
    return fields.map((field, index) => ({
      name: field.name,
      font: field.font ?? 'Arial',
      size: field.size ?? 20,
      sticky: field.sticky ?? false,
      rtl: field.rtl ?? false,
      ord: field.ord ?? index,
    }));
  }

  private processTemplates(templates: Template[]): Template[] {
    return templates.map((template, index) => ({
      name: template.name,
      qfmt: template.qfmt,
      afmt: template.afmt,
      bqfmt: template.bqfmt ?? '',
      bafmt: template.bafmt ?? '',
      did: template.did ?? null,
      bfont: template.bfont ?? '',
      bsize: template.bsize ?? 0,
      ord: template.ord ?? index,
    }));
  }

  private getDefaultCss(): string {
    return `.card {
  font-family: arial;
  font-size: 20px;
  text-align: center;
  color: black;
  background-color: white;
}`;
  }

  private getDefaultLatexPre(): string {
    return `\\documentclass[12pt]{article}
\\special{papersize=3in,5in}
\\usepackage[utf8]{inputenc}
\\usepackage{amssymb,amsmath}
\\pagestyle{empty}
\\setlength{\\parindent}{0in}
\\begin{document}`;
  }

  private getDefaultLatexPost(): string {
    return '\\end{document}';
  }

  /**
   * Generate the JSON representation for the Anki collection
   */
  toJson(): string {
    const modelData = {
      css: this.css,
      did: 1, // Default deck ID
      flds: this.fields.map((field) => ({
        font: field.font,
        media: [],
        name: field.name,
        ord: field.ord,
        rtl: field.rtl,
        size: field.size,
        sticky: field.sticky,
      })),
      id: this.modelId,
      latexPost: this.latexPost,
      latexPre: this.latexPre,
      mod: ankiTime(),
      name: this.name,
      req: [[0, 'any', [0]]], // Required fields
      sortf: 0, // Sort field
      tags: this.tags,
      tmpls: this.templates.map((template) => ({
        afmt: template.afmt,
        bafmt: template.bafmt,
        bfont: template.bfont,
        bqfmt: template.bqfmt,
        bsize: template.bsize,
        did: template.did,
        name: template.name,
        ord: template.ord,
        qfmt: template.qfmt,
      })),
      type: this.type,
      usn: -1, // Update sequence number
      vers: [], // Version
    };

    return JSON.stringify(modelData);
  }
}
