// src/pages/Owner/AIFeatures.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Typography, Card, CardContent, TextField, Button, Grid, Paper,
  Accordion, AccordionSummary, AccordionDetails, Alert, CircularProgress,
  Chip, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions
} from "@mui/material";
import {
  ExpandMore, Psychology, Email, Campaign, Receipt, Send, Lock, Upgrade
} from "@mui/icons-material";
import DashboardLayout from "../../common/DashboardLayout";
import { ownerMenu } from "../../common/navigation/ownerRoutes";
import { aiService } from "../../service/aiService";
import instance from "../../service/AxiosOrder";

export default function AIFeatures() {
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [loadingFeatures, setLoadingFeatures] = useState(true);
  const [responses, setResponses] = useState({});
  const [upgradeDialog, setUpgradeDialog] = useState(false);
  const [aiFeatures, setAiFeatures] = useState({
    AI_EMAIL: true,
    AI_INSIGHTS: false,
    AI_MARKETING: false,
    AI_INVOICE_SUMMARY: false,
    planInfo: {
      planName: 'No Plan',
      hasAiFeatures: false,
      monthlyPrice: 0.0
    }
  });

  const [forms, setForms] = useState({
    insights: { question: "" },
    email: { type: "THANK_YOU", context: "" },
    marketing: { productInfo: "", promotion: "" },
    invoice: { orderId: "" },
  });

  useEffect(() => {
    fetchAIFeatures();
  }, []);

  const fetchAIFeatures = async () => {
    setLoadingFeatures(true);
    try {
      const response = await instance.get('/api/v1/ai/features');
      setAiFeatures(response.data);
    } catch (error) {
      console.error('Error fetching AI features:', error);
    } finally {
      setLoadingFeatures(false);
    }
  };

  const handleInputChange = (category, field, value) => {
    setForms((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const checkFeatureAccess = (feature) => {
    if (!aiFeatures[feature]) {
      setUpgradeDialog(true);
      return false;
    }
    return true;
  };

  const handleGenerateInsights = async () => {
    if (!checkFeatureAccess('AI_INSIGHTS')) return;
    if (!forms.insights.question) return;

    setLoadingInsights(true);
    try {
      const response = await aiService.generateInsights(forms.insights.question);
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
    if (!checkFeatureAccess('AI_EMAIL')) return;
    if (!forms.email.context) return;

    setLoadingEmail(true);
    try {
      const response = await aiService.generateEmail(forms.email.type, forms.email.context);
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
    if (!checkFeatureAccess('AI_MARKETING')) return;
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
    if (!checkFeatureAccess('AI_INVOICE_SUMMARY')) return;
    if (!forms.invoice.orderId) return;

    setLoadingInvoice(true);
    try {
      const response = await aiService.generateInvoiceSummary(forms.invoice.orderId);
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

  if (loadingFeatures) {
    return (
      <DashboardLayout title="AI Features" menu={ownerMenu}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading AI features...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="AI Features" menu={ownerMenu}>
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 2, display: "flex", alignItems: "center" }}
        >
          <Psychology sx={{ mr: 2, color: "primary.main" }} />
          AI Business Assistant
        </Typography>

        {/* Subscription Plan Info */}
        <Alert 
          severity={aiFeatures.planInfo.hasAiFeatures ? "success" : "warning"} 
          sx={{ mb: 3 }}
        >
          <Typography variant="body1">
            Current Plan: <strong>{aiFeatures.planInfo.planName}</strong>
            {aiFeatures.planInfo.monthlyPrice > 0 && (
              <span> - LKR {aiFeatures.planInfo.monthlyPrice}/month</span>
            )}
          </Typography>
          <Typography variant="body2">
            {aiFeatures.planInfo.hasAiFeatures 
              ? "You have access to all AI features!"
              : "Upgrade to Pro plan to access all AI features."
            }
          </Typography>
        </Alert>

        <Grid container spacing={3}>
          {/* Business Insights */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ position: 'relative' }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Psychology sx={{ mr: 1, color: "primary.main" }} />
                    Business Insights
                  </Box>
                  {!aiFeatures.AI_INSIGHTS && (
                    <Chip icon={<Lock />} label="Pro Feature" color="warning" size="small" />
                  )}
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
                  disabled={!aiFeatures.AI_INSIGHTS}
                />
                <Button
                  variant="contained"
                  onClick={handleGenerateInsights}
                  disabled={loadingInsights || !forms.insights.question || !aiFeatures.AI_INSIGHTS}
                  startIcon={
                    loadingInsights ? <CircularProgress size={20} /> : <Send />
                  }
                  fullWidth
                >
                  {!aiFeatures.AI_INSIGHTS ? "Upgrade Required" : "Generate Insights"}
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
                  sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Email sx={{ mr: 1, color: "secondary.main" }} />
                    Email Generator
                  </Box>
                  <Chip icon={<Psychology />} label="Basic & Pro" color="success" size="small" />
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
                    <MenuItem value="COMPLAINT_RESPONSE">Complaint Response</MenuItem>
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
                  fullWidth
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
                  sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Campaign sx={{ mr: 1, color: "success.main" }} />
                    Marketing Post
                  </Box>
                  {!aiFeatures.AI_MARKETING && (
                    <Chip icon={<Lock />} label="Pro Feature" color="warning" size="small" />
                  )}
                </Typography>
                
                <TextField
                  fullWidth
                  label="Product/Service Info"
                  placeholder="High-performance laptops..."
                  value={forms.marketing.productInfo}
                  onChange={(e) =>
                    handleInputChange("marketing", "productInfo", e.target.value)
                  }
                  sx={{ mb: 2 }}
                  disabled={!aiFeatures.AI_MARKETING}
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
                  disabled={!aiFeatures.AI_MARKETING}
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleGenerateMarketing}
                  disabled={loadingPost || !forms.marketing.productInfo || !aiFeatures.AI_MARKETING}
                  startIcon={
                    loadingPost ? <CircularProgress size={20} /> : <Send />
                  }
                  fullWidth
                >
                  {!aiFeatures.AI_MARKETING ? "Upgrade Required" : "Generate Post"}
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
                  sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Receipt sx={{ mr: 1, color: "warning.main" }} />
                    Invoice Summary
                  </Box>
                  {!aiFeatures.AI_INVOICE_SUMMARY && (
                    <Chip icon={<Lock />} label="Pro Feature" color="warning" size="small" />
                  )}
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
                  disabled={!aiFeatures.AI_INVOICE_SUMMARY}
                />
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleGenerateInvoiceSummary}
                  disabled={loadingInvoice || !forms.invoice.orderId || !aiFeatures.AI_INVOICE_SUMMARY}
                  startIcon={
                    loadingInvoice ? <CircularProgress size={20} /> : <Send />
                  }
                  fullWidth
                >
                  {!aiFeatures.AI_INVOICE_SUMMARY ? "Upgrade Required" : "Generate Summary"}
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

        {/* Feature Comparison */}
        <Paper sx={{ mt: 4, p: 3, bgcolor: "grey.50" }}>
          <Typography variant="h6" gutterBottom>
            AI Feature Availability
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                icon={<Email />}
                label="Email Generator - Available"
                color="success"
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                icon={aiFeatures.AI_INSIGHTS ? <Psychology /> : <Lock />}
                label={`Business Insights - ${aiFeatures.AI_INSIGHTS ? 'Available' : 'Pro Only'}`}
                color={aiFeatures.AI_INSIGHTS ? 'success' : 'default'}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                icon={aiFeatures.AI_MARKETING ? <Campaign /> : <Lock />}
                label={`Marketing Posts - ${aiFeatures.AI_MARKETING ? 'Available' : 'Pro Only'}`}
                color={aiFeatures.AI_MARKETING ? 'success' : 'default'}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                icon={aiFeatures.AI_INVOICE_SUMMARY ? <Receipt /> : <Lock />}
                label={`Invoice Summary - ${aiFeatures.AI_INVOICE_SUMMARY ? 'Available' : 'Pro Only'}`}
                color={aiFeatures.AI_INVOICE_SUMMARY ? 'success' : 'default'}
                sx={{ width: '100%' }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Upgrade Dialog */}
        <Dialog open={upgradeDialog} onClose={() => setUpgradeDialog(false)}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
            <Upgrade sx={{ mr: 1 }} />
            Upgrade Required
          </DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              This AI feature is only available with the Pro subscription plan.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Plan: {aiFeatures.planInfo.planName}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Pro Plan includes:
            </Typography>
            <ul>
              <li>Business Insights AI</li>
              <li>Marketing Post Generator</li>
              <li>Invoice Summary AI</li>
              <li>Advanced Analytics</li>
              <li>Priority Support</li>
            </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpgradeDialog(false)}>
              Maybe Later
            </Button>
            <Button 
              variant="contained" 
              onClick={() => {
                setUpgradeDialog(false);
                // You can redirect to upgrade page or contact admin
                alert('Please contact your administrator to upgrade your plan.');
              }}
            >
              Contact Admin
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}