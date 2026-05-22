const chave = "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" 
const endereco = "https://api.groq.com/openai/v1/chat/completions"

const prompt = `Você é um designer web sênior nível Silicon Valley.
Crie uma landing page ULTRA PROFISSIONAL para o negócio descrito.

REGRAS ABSOLUTAS:
- Responda SOMENTE com HTML completo começando em <!DOCTYPE html>
- Zero markdown, zero explicações, zero crases
- Proibido usar tags <img>

HERO OBRIGATÓRIO:
- Envolva TUDO dentro de uma div.hero-content centralizada com flexbox
- Nunca deixe elementos soltos dentro do hero
- Fundo com gradiente animado via @keyframes
- Título h1 mínimo 52px, subtítulo h2 mínimo 20px
- Dois botões lado a lado com gap de 12px

CORES:
- PROIBIDO usar #3498db, #f1c40f, #2ecc71 ou qualquer cor genérica
- Crie uma paleta única e sofisticada para o negócio
- Defina: --cor-primaria, --cor-secundaria, --cor-acento, --cor-fundo, --cor-texto

TIPOGRAFIA:
- Importe UMA Google Font sofisticada (Playfair Display, Outfit, Syne, Raleway)
- h1: mínimo 52px, font-weight 900
- h2 de seção: mínimo 36px, font-weight 700
- body: 16px, line-height 1.7

CARDS:
- Sempre com border-radius mínimo 16px
- box-shadow: 0 4px 24px rgba(0,0,0,0.08)
- hover com transform: translateY(-6px) e transition 0.3s
- Nunca usar border: 1px solid #ddd simples

SEÇÕES OBRIGATÓRIAS:
1. Header fixo com backdrop-filter: blur(12px)
2. Hero com div.hero-content centralizada, título grande, 2 botões CTA
3. Barra de estatísticas (4 números impactantes)
4. Produtos em grid de 3 colunas com cards modernos
5. Diferenciais em 3 cards com ícone, título e texto
6. 2 depoimentos com avatar, nome, cargo e estrelas
7. Seção CTA final com fundo colorido
8. Footer escuro com 3 colunas

QUALIDADE FINAL:
- Espaçamento entre seções mínimo 80px
- Hierarquia visual clara em todas as seções
- Tudo responsivo com media queries
- Animação de fade-in no carregamento`

let ultimoResultado = ""

async function gerarCodigo() {
    const textarea = document.getElementById("texto-pagina").value.trim()
    const status = document.getElementById("status")
    const btn = document.getElementById("btn-gerar")

    if (!textarea) {
        status.textContent = "⚠️ Descreva seu negócio antes de gerar!"
        return
    }

    btn.disabled = true
    status.textContent = "⏳ Gerando..."

    try {
        const resposta = await fetch(endereco, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${chave}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                max_tokens: 8000,
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: textarea }
                ]
            })
        })

        const dados = await resposta.json()

        if (!dados.choices || !dados.choices[0]) {
            const mensagemErro = dados.error?.message || "Resposta inválida da API"
            throw new Error(mensagemErro)
        }

        let resultado = dados.choices[0].message.content
        resultado = resultado.replace(/```html/gi, "").replace(/```/g, "").trim()

        ultimoResultado = resultado
        document.querySelector(".bloco-codigo").textContent = resultado
        document.querySelector(".bloco-site").srcdoc = resultado

        status.textContent = "✅ Pronto!"

    } catch (erro) {
        status.textContent = `❌ Erro! ${erro.message}`
        console.error(erro)
    } finally {
        btn.disabled = false
    }
}
