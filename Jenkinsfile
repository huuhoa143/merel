pipeline {
    agent any

    stages {
      stage("Pre build") {
        steps {
          sh "pwd"
          sh "rm -rf .env.production"
        }
      }
      stage('Build') {
        steps {
          sh "printenv > .env.production"
          sh "echo Building the Docker image..."
          sh "sudo docker build -t $REPOSITORY_URI:latest -f production.Dockerfile ."
          sh "sudo docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$GIT_COMMIT"
        }
      }
      stage('Deploy') {
        when {
          expression {
            currentBuild.result == null || currentBuild.result == 'SUCCESS' 
          }
        }
        steps {
          echo "Deploying the Docker image..."
          sh "sudo docker network create $NETWORK || true"
          sh "sudo docker stop $CONTAINER_NAME || true && sudo docker rm $CONTAINER_NAME || true"
          sh "sudo docker run -d --name $CONTAINER_NAME \
                -p $MACHINE_PORT:$PORT \
                --env-file .env.production \
                --network=$NETWORK $REPOSITORY_URI:$GIT_COMMIT"
        }
      }
    }
}
