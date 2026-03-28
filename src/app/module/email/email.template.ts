const contactEmailTemplate = (name: string, email: string, message: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #171717; line-height: 1.5; margin: 0; padding: 40px 20px; }
        .container { max-width: 500px; margin: 0 auto; }
        .logo { font-size: 20px; font-weight: 800; border-bottom: 2px solid #10b981; display: inline-block; margin-bottom: 40px; }
        h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 24px; }
        .content { margin-bottom: 40px; }
        .field { margin-bottom: 24px; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #737373; letter-spacing: 0.05em; display: block; margin-bottom: 4px; }
        .value { font-size: 15px; color: #171717; }
        .message-box { background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #f0f0f0; margin-top: 10px; }
        .footer { font-size: 12px; color: #a3a3a3; border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">EcoSpark</div>
        <h1>New Message Received</h1>
        <div class="content">
            <div class="field">
                <span class="label">SENDER</span>
                <span class="value"><b>${name}</b> &lt;${email}&gt;</span>
            </div>
            <div class="field">
                <span class="label">MESSAGE</span>
                <div class="message-box">${message}</div>
            </div>
        </div>
        <div class="footer">
            Sent from your website contact form. &copy; ${new Date().getFullYear()} EcoSpark.
        </div>
    </div>
</body>
</html>
`;

const paymentSuccessTemplate = (name: string, amount: number, itemName: string, transactionId: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #171717; line-height: 1.5; margin: 0; padding: 40px 20px; }
        .container { max-width: 500px; margin: 0 auto; }
        .logo { font-size: 20px; font-weight: 800; border-bottom: 2px solid #10b981; display: inline-block; margin-bottom: 40px; }
        h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 8px; color: #10b981; }
        p { margin-bottom: 24px; color: #525252; }
        .receipt { background: #f9f9f9; padding: 24px; border-radius: 12px; border: 1px solid #f0f0f0; margin-bottom: 32px; }
        .receipt-row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px dashed #e5e5e5; padding-bottom: 8px; }
        .receipt-row:last-child { border: none; margin-bottom: 0; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #737373; }
        .value { font-size: 14px; font-weight: 600; text-align: right; }
        .footer { font-size: 12px; color: #a3a3a3; border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 40px; }
        .btn { display: inline-block; background: #171717; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">EcoSpark</div>
        <h1>Payment Successful!</h1>
        <p>Hi ${name}, thank you for your purchase. Your payment for <b>${itemName}</b> has been processed successfully.</p>
        
        <div class="receipt">
            <div class="receipt-row">
                <span class="label">Item</span>
                <span class="value">${itemName}</span>
            </div>
            <div class="receipt-row">
                <span class="label">Amount Paid</span>
                <span class="value">$${amount.toFixed(2)}</span>
            </div>
            <div class="receipt-row">
                <span class="label">Transaction ID</span>
                <span class="value" style="font-family: monospace; font-size: 12px;">${transactionId}</span>
            </div>
        </div>

        <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">View in Dashboard</a>

        <div class="footer">
            You received this email because of your recent purchase on EcoSpark Hub. &copy; ${new Date().getFullYear()} EcoSpark.
        </div>
    </div>
</body>
</html>
`;

export const EmailTemplate = {
    contactEmailTemplate,
    paymentSuccessTemplate,
};
