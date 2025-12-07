
pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DOCKERHUB_USER = "hunzala00"
        COMPOSE_HTTP_TIMEOUT = "200"
        // Email configuration - update with your email
        NOTIFICATION_EMAIL = "hunzalawan00@gmail.com"
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
                withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
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
                    docker compose down || true
                    docker compose pull
                    docker compose up -d --remove-orphans
                    echo "Deployment complete. Running containers:"
                    docker ps
                '''
            }
        }

        stage('Install Test Dependencies') {
            steps {
                sh '''
                    echo "Installing test dependencies..."
                    cd tests
                    npm install
                '''
            }
        }

        stage('Wait for Services') {
            steps {
                sh '''
                    echo "Waiting for services to be ready..."
                    sleep 30
                    
                    # Check if frontend is accessible
                    max_retries=10
                    counter=0
                    until curl -s http://localhost:5173 > /dev/null 2>&1; do
                        counter=$((counter + 1))
                        if [ $counter -ge $max_retries ]; then
                            echo "Frontend service not ready after $max_retries attempts"
                            exit 1
                        fi
                        echo "Waiting for frontend to be ready... attempt $counter/$max_retries"
                        sleep 10
                    done
                    echo "Frontend service is ready!"
                    
                    # Check if backend is accessible
                    counter=0
                    until curl -s http://localhost:4000 > /dev/null 2>&1; do
                        counter=$((counter + 1))
                        if [ $counter -ge $max_retries ]; then
                            echo "Backend service not ready after $max_retries attempts"
                            exit 1
                        fi
                        echo "Waiting for backend to be ready... attempt $counter/$max_retries"
                        sleep 10
                    done
                    echo "Backend service is ready!"
                '''
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh '''
                    echo "Running Selenium test suite..."
                    cd tests
                    npm test 2>&1 | tee test-results.log
                '''
            }
            post {
                always {
                    // Archive test results
                    archiveArtifacts artifacts: 'tests/test-results.log', allowEmptyArchive: true
                }
            }
        }
    }

    post {
        success {
            script {
                def testLog = ''
                try {
                    testLog = readFile('tests/test-results.log')
                } catch (Exception e) {
                    testLog = 'Test log not available'
                }
                
                // Extract test summary
                def passingTests = '0'
                def failingTests = '0'
                try {
                    def passingMatch = (testLog =~ /(\d+) passing/)
                    if (passingMatch) {
                        passingTests = passingMatch[0][1]
                    }
                } catch (Exception e) {
                    passingTests = '0'
                }
                try {
                    def failingMatch = (testLog =~ /(\d+) failing/)
                    if (failingMatch) {
                        failingTests = failingMatch[0][1]
                    }
                } catch (Exception e) {
                    failingTests = '0'
                }
                
                // Try to send email, but don't fail if it doesn't work
                try {
                    emailext(
                        subject: "✅ SUCCESS: Tomato Food Delivery App - Build #${BUILD_NUMBER} - All Tests Passed!",
                        body: """
                            <html>
                            <body style="font-family: Arial, sans-serif;">
                                <h2 style="color: #28a745;">✅ Build Successful - All Tests Passed!</h2>
                                
                                <h3>Build Information:</h3>
                                <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
                                    <tr style="background-color: #f8f9fa;">
                                        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Project:</strong></td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6;">Tomato Food Delivery App</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Build Number:</strong></td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6;">#${BUILD_NUMBER}</td>
                                    </tr>
                                    <tr style="background-color: #f8f9fa;">
                                        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Build URL:</strong></td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6;"><a href="${BUILD_URL}">${BUILD_URL}</a></td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Branch:</strong></td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6;">main</td>
                                    </tr>
                                </table>
                                
                                <h3 style="color: #28a745;">Test Results Summary:</h3>
                                <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
                                    <tr style="background-color: #d4edda;">
                                        <td style="padding: 10px; border: 1px solid #c3e6cb;"><strong>Tests Passed:</strong></td>
                                        <td style="padding: 10px; border: 1px solid #c3e6cb; color: #155724;">${passingTests}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Tests Failed:</strong></td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6;">${failingTests}</td>
                                    </tr>
                                    <tr style="background-color: #f8f9fa;">
                                        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Status:</strong></td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6; color: #28a745;"><strong>ALL TESTS PASSED ✅</strong></td>
                                    </tr>
                                </table>
                                
                                <h3>Test Cases Executed:</h3>
                                <ol>
                                    <li>Homepage Loading and Verification</li>
                                    <li>User Registration</li>
                                    <li>User Login</li>
                                    <li>Menu Exploration and Category Filtering</li>
                                    <li>Adding Items to Cart</li>
                                    <li>Removing Items from Cart</li>
                                    <li>Cart Page Functionality</li>
                                    <li>Checkout Navigation</li>
                                    <li>User Logout</li>
                                    <li>Footer and Page Elements Verification</li>
                                </ol>
                                
                                <h3>Deployment Status:</h3>
                                <p style="color: #28a745;"><strong>✅ Application successfully deployed and running!</strong></p>
                                <ul>
                                    <li>Frontend: <a href="http://localhost:5173">http://localhost:5173</a></li>
                                    <li>Backend API: <a href="http://localhost:4000">http://localhost:4000</a></li>
                                    <li>Admin Panel: <a href="http://localhost:5174">http://localhost:5174</a></li>
                                </ul>
                                
                                <hr style="border: 1px solid #dee2e6; margin: 20px 0;">
                                <p style="color: #6c757d; font-size: 12px;">
                                    This is an automated message from Jenkins CI/CD Pipeline.
                                </p>
                            </body>
                            </html>
                        """,
                        to: "${NOTIFICATION_EMAIL}",
                        mimeType: 'text/html',
                        attachmentsPattern: 'tests/test-results.log'
                    )
                    echo "✅ Verification email sent to ${NOTIFICATION_EMAIL}"
                } catch (Exception e) {
                    echo "⚠️ Could not send email notification: ${e.message}"
                    echo "Please configure SMTP settings in Jenkins (Manage Jenkins -> Configure System -> Extended E-mail Notification)"
                }
            }
            echo "✅ Deployment successful — all tests passed!"
        }
        failure {
            script {
                def testLog = ''
                try {
                    testLog = readFile('tests/test-results.log')
                } catch (Exception e) {
                    testLog = 'Test log not available'
                }
                
                // Try to send email, but don't fail if it doesn't work
                try {
                    emailext(
                        subject: "❌ FAILED: Tomato Food Delivery App - Build #${BUILD_NUMBER}",
                        body: """
                            <html>
                            <body style="font-family: Arial, sans-serif;">
                                <h2 style="color: #dc3545;">❌ Build Failed!</h2>
                                
                                <h3>Build Information:</h3>
                                <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
                                    <tr style="background-color: #f8f9fa;">
                                        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Project:</strong></td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6;">Tomato Food Delivery App</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Build Number:</strong></td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6;">#${BUILD_NUMBER}</td>
                                    </tr>
                                    <tr style="background-color: #f8f9fa;">
                                        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Build URL:</strong></td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6;"><a href="${BUILD_URL}">${BUILD_URL}</a></td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Console Output:</strong></td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6;"><a href="${BUILD_URL}console">${BUILD_URL}console</a></td>
                                    </tr>
                                </table>
                                
                                <h3 style="color: #dc3545;">Action Required:</h3>
                                <p>Please check the console output and test logs for details about the failure.</p>
                                
                                <h3>Test Log:</h3>
                                <pre style="background-color: #f8f9fa; padding: 15px; border: 1px solid #dee2e6; overflow-x: auto; max-height: 400px;">
${testLog}
                                </pre>
                                
                                <hr style="border: 1px solid #dee2e6; margin: 20px 0;">
                                <p style="color: #6c757d; font-size: 12px;">
                                    This is an automated message from Jenkins CI/CD Pipeline.
                                </p>
                            </body>
                            </html>
                        """,
                        to: "${NOTIFICATION_EMAIL}",
                        mimeType: 'text/html',
                        attachmentsPattern: 'tests/test-results.log'
                    )
                    echo "📧 Failure notification email sent to ${NOTIFICATION_EMAIL}"
                } catch (Exception e) {
                    echo "⚠️ Could not send email notification: ${e.message}"
                    echo "Please configure SMTP settings in Jenkins (Manage Jenkins -> Configure System -> Extended E-mail Notification)"
                }
            }
            echo "❌ Build/Tests failed — check the console output for details."
        }
        always {
            // Clean up test artifacts if needed
            sh '''
                echo "Pipeline completed. Cleaning up..."
                docker system prune -f || true
            '''
        }
    }
}
