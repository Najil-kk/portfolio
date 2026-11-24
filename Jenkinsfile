
pipeline {
    agent none

    stages {

        stage('Build') {
            agent {
                label 'buildnode'
            }

            steps {
                deleteDir()

                sh '''
                    echo "Starting Build Stage"

                    git clone https://github.com/Najil-kk/portfolio.git

                    ls -la
                    ls -la portfolio
                '''

                stash name: 'webpage',
                      includes: 'portfolio/**',
                      useDefaultExcludes: false

                echo 'Build Stage Completed'
            }
        }

        stage('Deploy') {
            agent {
                label 'deploynode'
            }

            steps {
                deleteDir()

                unstash 'webpage'

                sh '''
                    echo "Starting Nginx Deployment"

                    sudo mkdir -p /var/www/html

                    sudo rm -rf /var/www/html/*

                    sudo cp -r portfolio/. /var/www/html/

                    sudo systemctl restart nginx

                    echo "Deployment Completed Successfully"

                    ls -la /var/www/html/
                '''
            }
        }
    }

    post {
        success {
            echo 'BUILD AND DEPLOYMENT SUCCESSFUL!'
        }

        failure {
            echo 'BUILD OR DEPLOYMENT FAILED!'
        }
    }
}
