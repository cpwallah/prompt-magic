# FROM codercom/code-server:4.96.4

# USER root
# RUN apt-get update && \
#     apt-get install -y curl && \
#     curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
#     apt-get install -y nodejs && \
#     npm install -g pnpm && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*

# USER coder
# EXPOSE 8080
# CMD ["code-server", "--auth", "none", "--bind-addr", "0.0.0.0:8080", "/tmp/bolty-worker"]


FROM codercom/code-server:4.96.4

USER root
RUN apt-get update && \
    apt-get install -y curl unzip openjdk-17-jdk && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Android SDK
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    curl -fsSL https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -o /tmp/cmdline-tools.zip && \
    unzip /tmp/cmdline-tools.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip && \
    yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2"

# Ensure the mounted directory has correct permissions
RUN mkdir -p /tmp/bolty-worker && chown coder:coder /tmp/bolty-worker

USER coder
EXPOSE 8080
CMD ["code-server", "--auth", "none", "--bind-addr", "0.0.0.0:8080", "/tmp/bolty-worker"]


