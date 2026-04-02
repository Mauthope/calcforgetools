---
description: Pilares e ciclo PDCA do CalcForgeTools — diretrizes obrigatórias para qualquer implementação ou melhoria
---

# Pilares CalcForgeTools — Ciclo PDCA

Toda implementação ou melhoria no CalcForgeTools **DEVE** respeitar os pilares abaixo. Antes de qualquer mudança, validar que nenhum pilar será prejudicado. Se houver conflito, **avisar o usuário** para decisão conjunta.

## Pilares Obrigatórios

### 1. SEO Técnico (nunca regredir)
- Sitemap.xml completo e atualizado automaticamente
- Hreflang correto com cross-language slug mapping (via `lib/slugMaps.ts`)
- Canonical em todas as páginas
- robots.txt permitindo acesso total (exceto /api/)
- Schema.org: BreadcrumbList, FAQPage, WebApplication, Article
- Meta titles e descriptions bilíngues e otimizados
- x-default apontando para EN

### 2. Teia Interna e Navegação (link building)
- Toda calculadora tem: FAQ, Related Tools, Related Guides
- Todo guia tem: Related Tools apontando para calculadoras
- Categorias com cross-linking entre si
- Novas páginas devem ser linkadas a partir de páginas existentes
- **ATENÇÃO AO CONTADOR:** Sempre que criar ou remover uma calculadora, lembre-se de atualizar o contador manual numérico (ex: "8 Ferramentas") na Home (`src/app/[lang]/page.tsx`).

### 3. Conteúdo SEO Robusto (~900 palavras por guia)
- Framework: Citação → Curiosidade → Tabelas → Fórmulas → Exemplos → Erros comuns → Ações práticas
- Paridade PT↔EN obrigatória
- Guias atualizados com tabelas do ano vigente (2026+)

### 4. Calculadoras 100% à Prova de Falhas
- Fórmulas com fontes oficiais (gov.br, Portaria MPS, Lei)
- Tabelas INSS/IRRF atualizadas anualmente
- Labels bilíngues completos (sem fallback para EN em tela PT)
- Testes de build obrigatórios antes de push

### 5. Performance & Analytics
- Core Web Vitals otimizados (fonts swap, lazy loading, CSS mínimo)
- Microsoft Clarity ativo (afterInteractive)
- Sem bibliotecas externas desnecessárias
- Build deve compilar todas as páginas estáticas sem erro

### 6. Design Visual Premium
- Estilo Apple-inspired consistente
- Não alterar design ao fazer mudanças técnicas de SEO
- Bandeiras de idioma com imagens (não emojis)
- Animações suaves (Framer Motion) sem impacto em LCP

### 7. Localização de Conteúdo (Legal & Cultural)
- **Não apenas traduzir palavras:** O motor matemático e os inputs devem refletir o contexto do país alvo.
- **Diferenças Legais:** Se uma calculadora é ancorada numa lei estrita de um país (Ex: CLT brasileira), a versão em outro idioma `/en/` deve indicar enfaticamente que a matemática obedece à lei do país emissor (ex: *Disclaimer para expatriados*).
- **Adequação de Nicho:** Nunca empurrar encargos de folhas de pagamento brasileiros como padrão mundial para americanos. A depender do público, devem ser criadas calculadoras independentes (ex: *Calculadora CLT* restrita ao BR e uma futura *W-2 Tax Calculator* para os EUA).

### 8. Guias Inteligentes (Evergreen Sazonais)
- **O Conceito:** Ao planejar um artigo refém do ano vigente (ex: Black Friday, IPVA, Páscoa), a arquitetura exigida é a de um *Guia Inteligente*. 
- **Obrigatório o uso de Macros:** Nunca escreva o ano "2026" ou o preço exato fixo no arquivo JSON de escrita. Utilize as chaves analíticas (ex: `{{CURRENT_YEAR}}`, `{{MACRO_PRICE}}`).
- **Dynamic Content Engine:** Certifique-se de instruir o cruzamento da macro diretamente nas funções matemáticas em `src/lib/dynamicContentEngine.ts` para que o NextJS processe essa variável na fase de Build e o SEO não seja penalizado por Javascript em tela.

## Regra de Ouro — Ciclo PDCA
```
PLAN → DO → CHECK → ACT → (repetir)
```
- **Plan**: Pesquisar e planejar antes de implementar
- **Do**: Implementar respeitando todos os pilares
- **Check**: Build + validar que nada regrediu
- **Act**: Ajustar e documentar; novas melhorias viram novos pilares

> **Se qualquer mudança ameaçar um pilar, PARAR e avisar o usuário antes de prosseguir.**
