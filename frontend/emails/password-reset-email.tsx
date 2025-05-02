import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from "@react-email/components"

interface PasswordResetEmailProps {
  resetUrl: string
  userEmail: string
}

export default function PasswordResetEmail({ resetUrl, userEmail }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your AI Content Pilot password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset your password</Heading>
          <Text style={text}>
            We received a request to reset the password for your AI Content Pilot account associated with {userEmail}.
          </Text>
          <Text style={text}>Click the button below to reset your password. This link is valid for 24 hours.</Text>
          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>
          <Text style={text}>
            Or copy and paste this URL into your browser:{" "}
            <Link href={resetUrl} style={link}>
              {resetUrl}
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>If you didn&apos;t request a password reset, you can safely ignore this email.</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  borderRadius: "4px",
  maxWidth: "520px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
}

const buttonContainer = {
  margin: "24px 0",
  textAlign: "center" as const,
}

const button = {
  backgroundColor: "#6366f1",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 16px",
}

const link = {
  color: "#6366f1",
  textDecoration: "underline",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
}

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "22px",
}
