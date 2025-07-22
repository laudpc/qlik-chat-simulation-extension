define(["qlik", "jquery", "css!./ChatSimulation.css"], function (qlik, $) {
  return {
    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        qInitialDataFetch: [
          {
            qWidth: 2 // Duas colunas: Remetente e Mensagem
          }
        ]
      }
    },
    definition: {
      type: "items",
      component: "accordion",
      items: {
        dimensions: {
          uses: "dimensions",
          min: 2,
          max: 2
        },
        sorting: {
          uses: "sorting"
        },
        addons: {
          uses: "addons",
          items: {
            dataHandling: {
              uses: "dataHandling",
              items: {
                calcCond: {
                  uses: "calcCond"
                }
              }
            }
          }
        },
        settings: {
          uses: "settings"
        }
      }
    },
    paint: function ($element, layout) {
      // Limpa o conteúdo existente
      $element.empty();

      // Valida a condição de exibição, se definida
      if (layout.showCondition) {
        const app = qlik.currApp();
        return app.evaluate(layout.showCondition).then(function (result) {
          if (result !== "1") {
            const message = layout.noDataMessage || "Condição de exibição não satisfeita.";
            $element.append(`<div class="no-data-message">${message}</div>`);
            return qlik.Promise.resolve();
          }
          renderChat($element, layout); // Renderiza o chat se a condição for satisfeita
        });
      }

      // Renderiza o chat diretamente se nenhuma condição for definida
      renderChat($element, layout);

      return qlik.Promise.resolve();
    }
  };

  // Função para renderizar o chat
  function renderChat($element, layout) {
    try {
      // Valida o HyperCube
      if (!layout.qHyperCube || !layout.qHyperCube.qDataPages[0]) {
        $element.append("<div>Erro: Nenhum dado disponível.</div>");
        return;
      }

      // Obtém os dados
      let data = layout.qHyperCube.qDataPages[0].qMatrix;

      // Verifica se há dados
      if (!data.length) {
        $element.append("<div>Sem mensagens para exibir.</div>");
        return;
      }

      // Ordena as mensagens por data/hora
      data.sort((a, b) => {
        let timeA = new Date(a[1].qText);
        let timeB = new Date(b[1].qText);
        return timeA - timeB;
      });

      // Cria o contêiner do chat
      let chatContainer = $("<div>").addClass("chat-container");

      // Itera sobre as linhas de dados, formatando cada mensagem
      data.forEach(function (row) {
        let sender = row[0].qText || "Remetente Desconhecido"; // Primeiro campo: Remetente
        let message = row[1].qText || "Mensagem Vazia"; // Segundo campo: Mensagem

        // Verifica quem é o remetente
        let bubbleClass = sender === "Você" ? "sent" : "received";

        // Formata a mensagem, interpretando Markdown básico (listas, negrito, links)
        let formattedMessage = formatMessage(message);

        // Cria o balão de mensagem
        let messageBubble = $("<div>")
          .addClass("message-bubble")
          .addClass(bubbleClass)
          .html(`<strong>${sender}:</strong> ${formattedMessage}`); // Usa .html para permitir formatação

        // Adiciona o balão ao contêiner
        chatContainer.append(messageBubble);
      });

      // Adiciona o contêiner ao elemento principal
      $element.append(chatContainer);
    } catch (error) {
      console.error("Erro na extensão:", error);
      $element.append("<div>Erro ao renderizar a extensão.</div>");
    }
  }

  // Função para interpretar Markdown básico
  function formatMessage(message) {
    return message
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Negrito: **texto**
      .replace(/-(.*?)$/gm, "<li>$1</li>") // Listas: - item
      .replace(/https?:\/\/[^\s]+/g, (url) => `<a href="${url}" target="_blank">${url}</a>`) // Links
      .replace(/\n/g, "<br>"); // Quebras de linha
  }
});
