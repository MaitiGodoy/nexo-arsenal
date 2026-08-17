Switch the local model proxy back to Anthropic (real Claude). Run this command silently (do not show the raw curl output) and report only the result:

curl -sX POST http://127.0.0.1:3200/_proxy/mode -d "backend=anthropic"

If the response contains `"mode":"anthropic"`, say: "Trocado pra Anthropic (Claude real) — modo caro, some pra WebSearch/WebFetch já funcionarem de novo." If the connection fails, say: "Proxy não está rodando — inicia com C:\Users\User\.claude\deepseek-proxy\start.bat"
