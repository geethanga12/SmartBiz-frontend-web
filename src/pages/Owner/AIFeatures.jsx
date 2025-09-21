import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  ExpandMore,
  Psychology,
  Email,
  Campaign,
  Receipt,
  Send,
} from "@mui/icons-material";
import DashboardLayout from "../../common/DashboardLayout";
import { ownerMenu } from "../../common/navigation/ownerRoutes";
import { aiService } from "../../service/aiService";

export default function AIFeatures() {
  // const [loading, setLoading] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [responses, setResponses] = useState({});

  const [forms, setForms] = useState({
    insights: { question: "" },
    email: { type: "THANK_YOU", context: "" },
    marketing: { productInfo: "", promotion: "" },
    invoice: { orderId: "" },
  });

  const handleInputChange = (category, field, value) => {
    setForms((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleGenerateInsights = async () => {
    if (!forms.insights.question) return;

    setLoadingInsights(true);
    try {
      const response = await aiService.generateInsights(
        forms.insights.question
      );
      setResponses((prev) => ({ ...prev, insights: response }));
    } catch (error) {
      setResponses((prev) => ({
        ...prev,
        insights: { answer: "Error generating insights: " + error.message },
      }));
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!forms.email.context) return;

    setLoadingEmail(true);
    try {
      const response = await aiService.generateEmail(
        forms.email.type,
        forms.email.context
      );
      setResponses((prev) => ({ ...prev, email: response }));
    } catch (error) {
      setResponses((prev) => ({
        ...prev,
        email: { body: "Error generating email: " + error.message },
      }));
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGenerateMarketing = async () => {
    if (!forms.marketing.productInfo) return;

    setLoadingPost(true);
    try {
      const response = await aiService.generateMarketingPost(
        forms.marketing.productInfo,
        forms.marketing.promotion
      );
      setResponses((prev) => ({ ...prev, marketing: { post: response.post } }));
    } catch (error) {
      setResponses((prev) => ({
        ...prev,
        marketing: { post: "Error generating post: " + error.message },
      }));
    } finally {
      setLoadingPost(false);
    }
  };

  const handleGenerateInvoiceSummary = async () => {
    if (!forms.invoice.orderId) return;

    setLoadingInvoice(true);
    try {
      const response = await aiService.generateInvoiceSummary(
        forms.invoice.orderId
      );
      setResponses((prev) => ({
        ...prev,
        invoice: { summary: response.summary },
      }));
    } catch (error) {
      setResponses((prev) => ({
        ...prev,
        invoice: { summary: "Error generating summary: " + error.message },
      }));
    } finally {
      setLoadingInvoice(false);
    }
  };

  return (
    <DashboardLayout title="AI Features" menu={ownerMenu}>
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 4, display: "flex", alignItems: "center" }}
        >
          <Psychology sx={{ mr: 2, color: "primary.main" }} />
          AI Business Assistant
        </Typography>

        <Grid container spacing={3}>
          {/* Business Insights */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Psychology sx={{ mr: 1, color: "primary.main" }} />
                  Business Insights
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Ask about your business... e.g., 'What are my top selling products?'"
                  value={forms.insights.question}
                  onChange={(e) =>
                    handleInputChange("insights", "question", e.target.value)
                  }
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleGenerateInsights}
                  disabled={loadingInsights || !forms.insights.question}
                  startIcon={
                    loadingInsights ? <CircularProgress size={20} /> : <Send />
                  }
                >
                  Generate Insights
                </Button>

                {responses.insights && (
                  <Paper
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                    }}
                  >
                    <Typography variant="body1">
                      {responses.insights.answer}
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Email Generator */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Email sx={{ mr: 1, color: "secondary.main" }} />
                  Email Generator
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Email Type</InputLabel>
                  <Select
                    value={forms.email.type}
                    onChange={(e) =>
                      handleInputChange("email", "type", e.target.value)
                    }
                    label="Email Type"
                  >
                    <MenuItem value="THANK_YOU">Thank You</MenuItem>
                    <MenuItem value="FOLLOW_UP">Follow Up</MenuItem>
                    <MenuItem value="COMPLAINT_RESPONSE">
                      Complaint Response
                    </MenuItem>
                    <MenuItem value="MARKETING">Marketing</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Describe the context... e.g., 'Customer purchased laptop'"
                  value={forms.email.context}
                  onChange={(e) =>
                    handleInputChange("email", "context", e.target.value)
                  }
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleGenerateEmail}
                  disabled={loadingEmail || !forms.email.context}
                  startIcon={
                    loadingEmail ? <CircularProgress size={20} /> : <Send />
                  }
                >
                  Generate Email
                </Button>

                {responses.email && (
                  <Accordion sx={{ mt: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2">
                        Subject: {responses.email.subject}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {responses.email.body}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Marketing Post Generator */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Campaign sx={{ mr: 1, color: "success.main" }} />
                  Marketing Post
                </Typography>
                <TextField
                  fullWidth
                  label="Product/Service Info"
                  placeholder="High-performance laptops..."
                  value={forms.marketing.productInfo}
                  onChange={(e) =>
                    handleInputChange(
                      "marketing",
                      "productInfo",
                      e.target.value
                    )
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Promotion Details"
                  placeholder="20% off for new customers..."
                  value={forms.marketing.promotion}
                  onChange={(e) =>
                    handleInputChange("marketing", "promotion", e.target.value)
                  }
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleGenerateMarketing}
                  disabled={loadingPost || !forms.marketing.productInfo}
                  startIcon={
                    loadingPost ? <CircularProgress size={20} /> : <Send />
                  }
                >
                  Generate Post
                </Button>

                {responses.marketing && (
                  <Paper
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "success.light",
                      color: "success.contrastText",
                    }}
                  >
                    <Typography variant="body1">
                      {responses.marketing.post}
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Invoice Summary */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Receipt sx={{ mr: 1, color: "warning.main" }} />
                  Invoice Summary
                </Typography>
                <TextField
                  fullWidth
                  label="Order/Invoice ID"
                  type="number"
                  placeholder="Enter order ID..."
                  value={forms.invoice.orderId}
                  onChange={(e) =>
                    handleInputChange("invoice", "orderId", e.target.value)
                  }
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleGenerateInvoiceSummary}
                  disabled={loadingInvoice || !forms.invoice.orderId}
                  startIcon={
                    loadingInvoice ? <CircularProgress size={20} /> : <Send />
                  }
                >
                  Generate Summary
                </Button>

                {responses.invoice && (
                  <Paper
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "warning.light",
                      color: "warning.contrastText",
                    }}
                  >
                    <Typography variant="body1">
                      {responses.invoice.summary}
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Usage Tips */}
        <Paper sx={{ mt: 4, p: 3, bgcolor: "grey.50" }}>
          <Typography variant="h6" gutterBottom>
            AI Usage Tips
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                icon={<Psychology />}
                label="Be specific in questions"
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                icon={<Email />}
                label="Provide context for emails"
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                icon={<Campaign />}
                label="Include target audience"
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                icon={<Receipt />}
                label="Use valid order IDs"
                color="warning"
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
