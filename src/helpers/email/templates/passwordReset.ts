export const passwordResetTemplate = (fullName: string, resetLink: string) => {
    return `
    <html>
        <head>
            <style>
                button {
                    background-color: #4F98FF;
                    border: solid 1px white;
                    border-radius: 99px;
                    padding: 5px 10px
                }
                a {
                    color: white;
                    text-decoration: none;
                }
            </style>
        </head>
    <body>
        <p>Hi ${fullName},</p>
        <p>You requested to reset your password.</p>
        <p> Please, click the link below to reset your password</p>
        <button>
            <a href="${resetLink}">Reset Password</a>
        </button>
    </body>
</html>
    `
}