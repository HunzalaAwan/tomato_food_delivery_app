
pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DOCKERHUB_USER = "hunzala00"
        COMPOSE_HTTP_TIMEOUT = "200"
    }

    stages {
        stage('Checkout Code') {
            steps {
                sh '''
                    echo "Checking out latest code..."
                    if [ ! -d ".git" ]; then
                        git clone https://github.com/HunzalaAwan/tomato_food_delivery_app.git .
                    else
                        git pull origin main
                    fi
                '''
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                        echo "$PASS" | docker login -u "$USER" --password-stdin
                    '''
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                sh '''
                    echo "Building new Docker images..."
                    docker build -t $DOCKERHUB_USER/backend:latest ./backend
                    docker build -t $DOCKERHUB_USER/frontend:latest ./frontend
                    docker build -t $DOCKERHUB_USER/admin:latest ./admin

                    echo "Pushing images to Docker Hub..."
                    docker push $DOCKERHUB_USER/backend:latest
                    docker push $DOCKERHUB_USER/frontend:latest
                    docker push $DOCKERHUB_USER/admin:latest
                '''
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                    echo "Deploying with Docker Compose..."
                    docker-compose down || true
                    docker-compose pull
                    docker-compose up -d --remove-orphans
                    echo "Deployment complete. Running containers:"
                    docker ps
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful — new images built and running!"
        }
        failure {
            echo "❌ Deployment failed — check the console output for errors."
        }
    }
}
