# EmailJS Setup Guide for Contact Form

The contact form has been updated to use EmailJS for sending emails. Follow these steps to complete the setup:

## Step 1: Create an EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account (allows 200 emails/month)
3. Verify your email address

## Step 2: Set Up Eml Service

1. **Go to Email Services**:

   - In your EmailJS dashboard, click "Email Services"
   - Click "Add New Service"

2. **Choose Email Provider**:

   - **Gmail** (recommended for testing): Select Gmail and connect your Gmail account
   - **Outlook**: For Microsoft email accounts
   - **EmailJS** (their service): For custom domains
   - **Others**: Yahoo, custom SMTP, etc.

3. **Configure Service**:
   - Follow the setup wizard for your chosen provider
   - Note down the **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. **Go to Email Templates**:

   - Click "Email Templates" in the dashboard
   - Click "Create New Template"

2. **Template Configuration**:

   ```
   Template Name: Contact Form Submission
   Template ID: Will be auto-generated (e.g., template_xyz789)
   ```

3. **Template Content**:

   ```
   Subject: New Contact Form Submission: {{subject}}

   From: {{from_name}} <{{from_email}}>

   Subject: {{subject}}

   Message:
   {{message}}

   ---
   Reply to this email to respond directly to {{from_name}}.
   Sent at: {{sent_at}}
   ```

4. **Template Settings**:
   - Set "To Email" to your business email
   - Set "From Name" to "{{from_name}}"
   - Set "Reply To" to "{{reply_to}}"

## Step 4: Get Your Credentials

1. **Get Public Key**:

   - Go to "Account" → "General"
   - Copy your **Public Key** (e.g., `user_1234567890abcdef`)

2. **Get Service ID**:

   - From your Email Services section

3. **Get Template ID**:
   - From your Email Templates section

## Step 5: Update Environment Variables

Update your `.env` file with the actual values:

```env
VITE_EMAILJS_SERVICE_ID=service_your_actual_id
VITE_EMAILJS_TEMPLATE_ID=template_your_actual_id
VITE_EMAILJS_PUBLIC_KEY=user_your_actual_public_key
```

## Step 6: Test the Setup

1. **Start your development server**:

   ```bash
   npm run dev
   ```

2. **Navigate to the contact page** and fill out the form

3. **Check the browser console** for any errors

4. **Check your email** for the test message

## Recommended Email Template HTML

For better formatting, you can use HTML in your template:

```html
<h2>New Contact Form Submission</h2>

<p><strong>From:</strong> {{from_name}} &lt;{{from_email}}&gt;</p>
<p><strong>Subject:</strong> {{subject}}</p>

<h3>Message:</h3>
<div
  style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;"
>
  {{message}}
</div>

<hr />
<p><small>Sent on {{sent_at}}</small></p>
<p><small>Reply to this email to respond directly to the sender.</small></p>
```

## Security Notes

- ✅ **Safe to expose**: EmailJS Public Key (it's meant to be public)
- ✅ **Safe to expose**: Service ID and Template ID
- ⚠️ **Keep private**: Your EmailJS account password
- ⚠️ **Keep private**: Any email account passwords

## Troubleshooting

### Common Issues:

1. **"EmailJS is not properly configured"**:

   - Check that all three environment variables are set
   - Restart your development server after updating `.env`

2. **"Failed to send message"**:

   - Verify your Service ID and Template ID are correct
   - Check EmailJS dashboard for any service issues

3. **Emails not received**:

   - Check spam/junk folder
   - Verify the "To Email" in your template settings
   - Test with EmailJS dashboard's "Send Test" feature

4. **CORS errors**:
   - Make sure you're using the correct Public Key
   - EmailJS should handle CORS automatically

### Testing in EmailJS Dashboard:

1. Go to your Email Templates
2. Click your template
3. Click "Send Test"
4. This will help verify your template and service work correctly

## Next Steps After Setup:

1. **Style improvements**: The form styling can be enhanced in `ContactPage.css`
2. **Auto-reply**: Set up an auto-reply template for users
3. **Analytics**: Track form submissions
4. **Validation**: Add more form validation
5. **Rate limiting**: Consider adding rate limiting for spam prevention

## Production Deployment:

When deploying to production (Vercel, Netlify, etc.):

1. Add the same environment variables to your hosting platform
2. Test the form on the live site
3. Monitor EmailJS dashboard for usage statistics

---

**That's it!** Once you complete these steps, your contact form will send real emails. The form includes proper error handling and user feedback for a professional experience.
