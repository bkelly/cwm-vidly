const aws = require('aws-sdk');
const ses = new aws.SES({
   region: 'us-east-1'
});

exports.handler = function(event, context) {
    console.log("Incoming: ", event);

    let eParams = {
        Destination: {
            ToAddresses: ["ben.kelly+AWS_SES@gmail.com"]
        },
        Message: {
            Body: {
                Text: {
                    Data: "Commencing deployment to vidly "
                }
            },
            Subject: {
                Data: "Commencing deployment to vidly"
            }
        },
        Source: "ben.kelly+AWS_SES@gmail.com"
    };

    console.log('===SENDING EMAIL===');
    const email = ses.sendEmail(eParams, function(err, data){
        if(err) console.log(err);
        else {
            console.log("===EMAIL SENT===");
            console.log(data);

            console.log("EMAIL CODE END");
            console.log('EMAIL: ', email);
            context.succeed(event);

        }
    });
};