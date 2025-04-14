.PHONY: build clean deploy

# 构建项目
build:
	yarn install
	yarn build

# 清理 site 目录
clean:
	rm -rf site/*
	mkdir -p site

# 构建并拷贝到 site 目录
deploy: clean build
	cp -r dist/* site/

# 启动 Docker Compose 项目
up:
	docker compose up -d
