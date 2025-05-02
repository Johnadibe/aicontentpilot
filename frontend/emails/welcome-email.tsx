import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components"

interface WelcomeEmailProps {
  loginUrl: string
  userName: string
}

export default function WelcomeEmail({ loginUrl, userName }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to AI Content Pilot!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to AI Content Pilot!</Heading>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>Thank you for joining AI Content Pilot! We're excited to have you on board.</Text>
          <Text style={text}>
            With AI Content Pilot, you can create amazing content for blogs, social media, emails, and more with the
            power of AI.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={loginUrl}>
              Get Started
            </Button>
          </Section>
          <Text style={text}>
            If you have any questions or need assistance, our support team is here to help. Just reply to this email or
            contact us through our support portal.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>AI Content Pilot - Create amazing content with AI</Text>
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
