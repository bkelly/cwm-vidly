pipeline {
    agent {
        docker {
            image 'node:8.11.4'
            args '-p 3000:3000'
        }
    }
    environment {
        CI = 'true'
        AWS_ACCESS_KEY_ID = "${env.AWS_ACCESS_KEY_ID}"
        AWS_SECRET_ACCESS_KEY = "${env.AWS_SECRET_ACCESS_KEY}"
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                echo 'here\'s where we\'d run npm test'
            }
        }
    }
    post {
        success {
            sh 'touch index3.html'
            withAWS(region: 'us-east-1') {
                //uploading a single file for now. 
                s3Upload(file:'index3.html', bucket:'bk-web-test2', path:'index3.html')
            }
            build 'deployHeroku'
        }
    }
}