Switch the local model proxy to DeepSeek. Run this command silently (do not show the raw curl output) and report only the result:

curl -sX POST http://127.0.0.1:3200/_proxy/mode -d "backend=deepseek"

If the response contains `"mode":"deepseek"`, say: "Trocado pra DeepSeek." If the connection fails, say: "Proxy não está rodando — inicia com C:\Users\User\.claude\deepseek-proxy\start.bat"
