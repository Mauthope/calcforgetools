# CalcForgeTools - System Design & Architecture Guide

Este documento serve como a **Bíblia de Identidade Visual e Arquitetural** da marca CalcForgeTools. Utilize este arquivo como contexto (`system prompt` ou arquivo base) ao iniciar novos chats ou agentes de IA para criar novos subdomínios, garantindo que todo o ecossistema mantenha exatamente o mesmo padrão "Apple-Inspired" e de alta performance.

---

## 1. Stack Tecnológica Base
Todo novo projeto sob o leque CalcForgeTools deve seguir estritamente o seguinte framework:
*   **Framework:** Next.js 16+ (App Router)
*   **Linguagem:** TypeScript (Strict mode)
*   **Estilização:** Tailwind CSS (focado em classes utilitárias e CSS customizável dinâmico)
*   **Gerenciamento de Tema:** `next-themes` (para transição perfeita entre *Light* e *Dark* mode).
*   **Navegação e Layouts:** SPA-feel com pre-fetching nativo do Next.js.
*   **Ícones:** Biblioteca mínima (geralmente Lucide-react ou emojis de sistema em SVG).

---

## 2. Filosofia Visual (O "Padrão CalcForge")

O padrão estabelecido para a marca rejeita excessos (como glows neon, glassmorphisms pesados e opacidades complexas) em favor do **Minimalismo Absoluto e Ultrafuncional (Estilo Apple / iOS Settings)**. 

### Regras de Ouro:
1. **Contraste Extremo:** O texto deve saltar aos olhos. Numerais finais devem ser grandiosos.
2. **Paz Visual:** Fundos devem ser na maior parte brancos/cinzas muito claros (ou cinzas puros e silenciosos no dark mode).
3. **Uso de Cores Semânticas Limpo:** Vermelho para perda, Verde para ganho líquido, Azul para cenário alternativo. Essas cores NUNCA devem inundar os blocos. Elas devem ser usadas apenas nos textos ou em fundos sumariamente transparentes (`bg-green-500/10`).
4. **Agrupamento Lógico:** Separar informações financeiras com linhas finíssimas. O design não precisa de 10 cores diferentes; precisa de **hierarquia de fonte**.

---

## 3. Sistema de Cores e Estilos Globais

Em vez de depender de classes genéricas mutáveis como `bg-gray-100`, nosso ecossistema deve SEMPRE ancorar na estrutura primária global configurada no `.css`:

*   **Fundos (Containers/Cards):** `bg-[var(--color-surface)]`
*   **Bordas:** `border-[var(--color-border)]` (sempre finas, ex: `border` genérico)
*   **Texto Principal (Títulos, Totais e Labels de destaque):** `text-[var(--color-text-primary)]`
*   **Texto Secundário (Descrições, Etiquetas pequenas):** `text-[var(--color-text-secondary)]`

### Estrutura Base no `globals.css` (Exemplo a replicar):
```css
:root {
  --color-surface: #ffffff; /* ou um leve off-white */
  --color-border: #e2e8f0;
  --color-text-primary: #0f172a;  /* slate-900 */
  --color-text-secondary: #64748b; /* slate-500 */
}

.dark {
  --color-surface: #1e293b; /* rgba base escuro */
  --color-border: rgba(255, 255, 255, 0.1);
  --color-text-primary: #f8fafc; /* slate-50 */
  --color-text-secondary: #94a3b8; /* slate-400 */
}
```

---

## 4. Tipografia e Anatomia de Layout

Use variações precisas de tamanho de fonte (`text-[XXpx]`) para não prender o layout às quebras genéricas do Tailwind (`text-sm`, `text-lg`).

*   **Super Tags (Categorias minúsculas):** `text-[13px] font-medium tracking-wide uppercase`
*   **Rótulos Padrões (Itens de lista/Despesas):** `text-[14px] font-medium` ou `text-[15px]`
*   **SubTítulos (Nomes de painéis):** `text-lg font-semibold tracking-tight`
*   **Mega Totais:** `text-3xl font-black tracking-tight`

---

## 5. Snippets Reutilizáveis (Para IAs Copiarem)

### Componente A: Painel "Container" Padrão de Resultados
Use esta estrutura exata de div para desenhar os painéis de resultados (Cards Gigantes) que o usuário interage visualmente.

```tsx
<div className="flex flex-col gap-0 bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] shadow-sm overflow-hidden">
  
  {/* Cabeçalho do Card */}
  <div className="p-6 pb-4 bg-gray-50/50 dark:bg-white/5">
    <h4 className="font-semibold text-lg tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
       <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm">💡</span>
       Nome do Painel
    </h4>
  </div>
  
  {/* Corpo do Card (Onde linhas e contas entram) */}
  <div className="px-6 flex flex-col gap-0">
     
     {/* Bloco Individual Exemplo */}
     <div className="py-4 border-t border-[var(--color-border)]">
        <div className="text-[13px] font-medium text-[var(--color-text-secondary)] mb-1">
           Descrição do que é este número (Perda/Ganho)
        </div>
        <div className="flex flex-col gap-3">
             <div className="flex justify-between items-center transition-opacity hover:opacity-80">
               <span className="text-[14px] text-[var(--color-text-secondary)]">Label Sub-item</span>
               <span className="text-[15px] font-bold text-[var(--color-text-primary)]">R$ 10.000,00</span>
            </div>
        </div>
     </div>

  </div>

  {/* Rodapé de Total Líquido (Ultra Destacado) */}
  {/* Exemplo de Ganho: bg-green e text-green */}
  <div className="mt-auto bg-green-50 dark:bg-green-900/10 p-6 border-t border-green-200 dark:border-green-800/30">
      <div className="text-[13px] font-bold text-green-700 dark:text-green-400 tracking-wide uppercase mb-1">
         Resultado Absoluto Final
      </div>
      <div className="text-3xl font-black tracking-tight text-[var(--color-text-primary)]">
         R$ 1.500.000,00
      </div>
  </div>
</div>
```

### Componente B: Toggle Switch Elegante
Evite checkboxes normais. Use o modelo de botões lado-a-lado, onde o selecionado fica com fundo azul/branco estilo widget iOS.

```tsx
<div className="bg-gray-100/80 dark:bg-slate-800 p-1 flex rounded-xl w-fit">
  <button
    className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm
      ${isActive 
        ? "bg-white text-blue-600 dark:bg-slate-700 dark:text-blue-400" 
        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"}`}
  >
    Opção Ativa
  </button>
  <button
    className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-none
      ${!isActive 
        ? "bg-white text-[var(--color-text-primary)] dark:bg-slate-700" 
        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"}`}
  >
    Opção Inativa
  </button>
</div>
```

---

## 6. Como dar o prompt nas futuras sessões
Sempre inicie seus novos chats subindo este arquivo junto ou anexando o seguinte pedaço de texto:

> *"Aja como um desenvolvedor Senior focado na stack do CalcForgeTools (Next.js, TS, Tailwind). Use os princípios arquiteturais listados no arquivo `calcforgetools-system-design-guide.md`. O front-end PRECISA focar estritamente em 'Minimalismo Inclinado Apple' (uso das variáveis CSS de root para superfície e cores primárias de texto, fontes tracking-tight, sem glows, sem sombras carregadas).*
