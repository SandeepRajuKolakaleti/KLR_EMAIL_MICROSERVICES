
export class AppConstants {
    constructor() {}

    public static app = {
        xyz: 'xyz',
        jwt: {
            expiryTime: 3600,
            type: 'JWT' 
        },
        testMail: {
            toEmail: 'sandeepraju538@gmail.com',
            fromEmail: 'klrtechnogroups@gmail.com',
            subject: 'Test Mail',
            body: (value) => {
                return `Hi User: ${value}, You are Successfully Logged in`;
            }
        },
        Templates : {
            sendEmail: {
                KLRSubject: 'KLR: ',
                KLRDescription: 'KLR Software Solutions Pvt Ltd'
            }
        }
    };

}