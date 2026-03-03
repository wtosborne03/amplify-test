'use client';

import { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ExecutionResult {
    executionArn?: string;
    status?: string;
    startDate?: string;
    stopDate?: string;
    output?: string;
    input?: string;
}

export default function StepFunctionsDemo() {
    const [inputValue, setInputValue] = useState('42');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const [result, setResult] = useState<ExecutionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const startExecution = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/step-functions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'start',
                    input: {
                        data: {
                            value: parseInt(inputValue) || 0,
                            timestamp: new Date().toISOString(),
                        },
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to start execution');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const checkStatus = async () => {
        if (!result?.executionArn) return;

        setChecking(true);
        setError(null);

        try {
            const response = await fetch('/api/step-functions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'describe',
                    executionArn: result.executionArn,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to check status');
            }

            const data = await response.json();
            setResult({ ...result, ...data });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setChecking(false);
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'SUCCEEDED':
                return 'success';
            case 'FAILED':
                return 'error';
            case 'RUNNING':
                return 'info';
            default:
                return 'default';
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Step Functions Demo
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    This demo shows a simple AWS Step Functions state machine that validates,
                    processes, and transforms data through multiple Lambda function invocations.
                </Typography>

                <Box sx={{ mt: 4 }}>
                    <TextField
                        fullWidth
                        label="Input Value"
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        helperText="Enter a positive number to pass validation"
                        sx={{ mb: 3 }}
                    />

                    <Button
                        variant="contained"
                        size="large"
                        startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
                        onClick={startExecution}
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? 'Starting Execution...' : 'Start Execution'}
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mt: 3 }}>
                        {error}
                    </Alert>
                )}

                {result && (
                    <Card sx={{ mt: 4 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Execution Result</Typography>
                                {result.status && (
                                    <Chip
                                        label={result.status}
                                        color={getStatusColor(result.status)}
                                        size="small"
                                    />
                                )}
                            </Box>

                            {result.executionArn && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Execution ARN
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            wordBreak: 'break-all',
                                            fontFamily: 'monospace',
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        {result.executionArn}
                                    </Typography>
                                </Box>
                            )}

                            {result.startDate && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Started
                                    </Typography>
                                    <Typography variant="body2">
                                        {new Date(result.startDate).toLocaleString()}
                                    </Typography>
                                </Box>
                            )}

                            {result.stopDate && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Completed
                                    </Typography>
                                    <Typography variant="body2">
                                        {new Date(result.stopDate).toLocaleString()}
                                    </Typography>
                                </Box>
                            )}

                            {result.output && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Output
                                    </Typography>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            mt: 1,
                                            bgcolor: 'grey.50',
                                            maxHeight: 200,
                                            overflow: 'auto',
                                        }}
                                    >
                                        <pre style={{ margin: 0, fontSize: '0.75rem' }}>
                                            {JSON.stringify(JSON.parse(result.output), null, 2)}
                                        </pre>
                                    </Paper>
                                </Box>
                            )}

                            <Button
                                variant="outlined"
                                startIcon={checking ? <CircularProgress size={16} /> : <RefreshIcon />}
                                onClick={checkStatus}
                                disabled={checking}
                                fullWidth
                            >
                                {checking ? 'Checking Status...' : 'Refresh Status'}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        State Machine Flow:
                    </Typography>
                    <Typography variant="body2" component="div">
                        1. Validate → Checks if input value is positive
                        <br />
                        2. Process → Adds processing metadata
                        <br />
                        3. Transform → Transforms the processed data
                        <br />
                        4. Success → Completes execution
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}
