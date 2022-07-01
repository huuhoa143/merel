build-local:
	docker build -t merel:local .

start:
	docker-compose up -d

stop:
	docker-compose stop

down:
	docker-compose down

logs:
	docker-compose logs -f merel
