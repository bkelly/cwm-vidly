pipeline {
    agent {
        dockerfile {
            args '-p 3000:3000'
            dir 'build'
        }
    }
    environment {
        CI = 'true'
        AWS_ACCESS_KEY_ID = "${env.AWS_ACCESS_KEY_ID}"
        AWS_SECRET_ACCESS_KEY = "${env.AWS_SECRET_ACCESS_KEY}"
        NODE_ENV = "development"
        vidly_db = ""
        vidly_jwtPrivateKey = "derp"
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
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