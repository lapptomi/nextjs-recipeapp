import { Box, Container, Link, Typography } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" className="mb-2" fontWeight="bold">
        Privacy Policy
      </Typography>

      <Typography variant="body1" color="text.secondary" className="mb-6">
        Last Updated: {new Date().toLocaleDateString()}
      </Typography>

      <Typography variant="body1" className="mb-6">
        This policy explains how we manage your personal data when you use our website.
      </Typography>

      <Box component="section" sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2" className="mb-2" fontWeight="bold">
          1. Data Collection
        </Typography>
        <Typography variant="body1" className="mb-2">
          We collect the minimum data required for authentication and security:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2 }}>
          <Typography component="li" variant="body1">
            <strong>Account Data:</strong> Name, email, and profile image (via Google or GitHub
            login).
            <br />
            If you sign up without Google or GitHub login, we store your email, username and hashed
            password.
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Log Data:</strong> IP address and browser info for security logging.
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Cookies:</strong> Strictly necessary cookies for maintaining your login session.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2" className="mb-2" fontWeight="bold">
          2. Use of Data
        </Typography>
        <Typography variant="body1">
          We use your data solely to authenticate your identity, manage your account, and ensure
          service security. We do not sell data or use it for marketing.
        </Typography>
      </Box>

      <Box component="section" sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2" className="mb-2" fontWeight="bold">
          3. Infrastructure & Retention
        </Typography>
        <Typography variant="body1" className="mb-2">
          <strong>Hosting & Database:</strong> We utilize secure, industry-standard cloud
          infrastructure providers to host our services and store data. Passwords are securely
          hashed using industry-standard algorithms. Other personal data, such as email, name, and
          profile images, is stored securely and protected against unauthorized access.
        </Typography>

        <Typography variant="body1">
          <strong>Retention:</strong> Data is retained while your account is active. Upon account
          deletion, your account and all related data is removed immediately. Encrypted database
          backups are retained by our provider for up to 30 days before permanent deletion.
        </Typography>
      </Box>

      <Box component="section" sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2" className="mb-2" fontWeight="bold">
          4. Your Rights
        </Typography>
        <Typography variant="body1" className="mb-2">
          You have the right to access, correct, or delete your data, or withdraw consent for
          processing.
        </Typography>
        <Typography variant="body1">
          To exercise these rights, contact:{" "}
          <Link href="mailto:privacy@yourdomain.com">privacy@yourdomain.com</Link>
        </Typography>
      </Box>
    </Container>
  );
}
