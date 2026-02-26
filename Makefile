.PHONY: dev stop restart status logs build lint lint-fix test clean help

APP_NAME   := the-forge
IMAGE_NAME := the-forge
COMPOSE    := docker compose

## ── Development ─────────────────────────────────────────────

dev: ## Start the dev server via Docker Compose
	$(COMPOSE) up -d forge-dev
	@echo "🔥 Forge dev server running at http://localhost:3000"

stop: ## Stop the dev server
	$(COMPOSE) down
	@echo "Stopped."

restart: stop dev ## Restart the dev server

status: ## Show running container status
	$(COMPOSE) ps

logs: ## Tail dev server logs
	$(COMPOSE) logs -f forge-dev

## ── Build ───────────────────────────────────────────────────

build: ## Build the production Docker image
	docker build -t $(IMAGE_NAME) .
	@echo "Production image built: $(IMAGE_NAME)"

## ── Quality ─────────────────────────────────────────────────

lint: ## Run ESLint
	$(COMPOSE) exec forge-dev npx next lint

lint-fix: ## Run ESLint with auto-fix
	$(COMPOSE) exec forge-dev npx next lint --fix

test: ## Run the test suite
	$(COMPOSE) exec forge-dev npx jest

## ── Cleanup ─────────────────────────────────────────────────

clean: ## Stop containers, remove volumes, prune build cache
	$(COMPOSE) down -v --remove-orphans
	docker image rm -f $(IMAGE_NAME) 2>/dev/null || true
	@echo "Cleaned."

## ── Help ────────────────────────────────────────────────────

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'
