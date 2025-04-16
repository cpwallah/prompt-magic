FROM codercom/code-server:4.96.4

USER root
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

USER coder
EXPOSE 8081
CMD ["code-server", "--auth", "none", "--bind-addr", "0.0.0.0:8081", "/tmp/bolty-worker"]