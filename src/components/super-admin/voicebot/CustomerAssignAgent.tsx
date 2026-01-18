import React, { useState, useEffect } from 'react';
import {
    BotMessageSquare,
    Phone,
    ArrowLeft,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import adminAgentService from "@/api/adminAgentService";
import { toast } from "@/hooks/useToast";
import { AxiosRequestConfig } from "axios";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useParams } from 'react-router-dom';

interface CustomerAssignAgentProps {
    onClose: () => void;
    onSuccess: () => void;
}

function CustomerAssignAgent({ onClose, onSuccess }: CustomerAssignAgentProps) {
    const [step, setStep] = useState<1 | 2>(1);

    // Agent Template State
    const [templates, setTemplates] = useState<any[] | null>(null);
    const [templatesLoading, setTemplatesLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

    // Phone Number State
    const [phoneNumbers, setPhoneNumbers] = useState<any[] | null>(null);
    const [phoneNumbersLoading, setPhoneNumbersLoading] = useState(false);
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string>("");

    // Assignment State
    const [assignLoading, setAssignLoading] = useState(false);

    const { id } = useParams();

    const agentTemplateSize = 10;
    const getAgentTemplates = async (page: number = 1, pageSize: number = agentTemplateSize) => {
        try {
            setTemplatesLoading(true);
            const config: AxiosRequestConfig = {
                params: {
                    include_inactive: false,
                    page,
                    page_size: pageSize
                }
            };
            const response = await adminAgentService.getAllAssistants(config);
            console.log(response.data.assistants);
            setTemplates(response.data.assistants);
        } catch (error) {
            // console.log(error);
            toast.danger("Failed to fetch agent templates");
        }
        finally {
            setTemplatesLoading(false);
        }
    }

    const fetchPhoneNumbers = async () => {
        try {
            setPhoneNumbersLoading(true);
            const response = await adminAgentService.getAllPhoneNumbers({});
            console.log('response', response);
            if (response && response.phoneNumbers) {
                setPhoneNumbers(response.phoneNumbers);
                if (response.phoneNumbers.length > 0) {
                    setSelectedPhoneNumber(response.phoneNumbers[0].id);
                }
            }
        } catch (error) {
            toast.danger("Failed to load phone numbers")
        }
        finally {
            setPhoneNumbersLoading(false);
        }
    };

    const confirmAssignment = async () => {

        try {
            setAssignLoading(true);
            const payload = {
                assistantId: selectedTemplate.vapiId,
                userId: id,
                phoneNumberId: selectedPhoneNumber
            };

            await adminAgentService.assignAssistantToUser(payload, {});
            // Simulation of async operation
            // await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Agent assigned successfully");
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error(error);
            toast.danger("Failed to assign agent");
        } finally {
            setAssignLoading(false);
        }
    }

    useEffect(() => {
        if (step === 1 && !templates) {
            getAgentTemplates();
        } else if (step === 2 && !phoneNumbers) {
            fetchPhoneNumbers();
        }
    }, [step]);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {step === 1 && (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-text-main">Select Agent</h3>
                        <p className="text-sm text-text-muted">Choose an agent to assign.</p>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {templatesLoading ? (
                            <div className="flex flex-col gap-4 w-full">
                                <Skeleton className="w-full h-20 rounded-xl" />
                                <Skeleton className="w-full h-20 rounded-xl" />
                                <Skeleton className="w-full h-20 rounded-xl" />
                                <Skeleton className="w-full h-20 rounded-xl" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {templates?.map((template: any) => (
                                    <button
                                        key={template.id}
                                        onClick={() => {
                                            setSelectedTemplate(template);
                                            setStep(2);
                                        }}
                                        className="group flex items-center gap-4 p-4 rounded-xl border border-border-subtle hover:border-primary hover:bg-primary/5 transition-all text-left bg-card"
                                    >
                                        <div className="p-2.5 bg-primary-soft rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <BotMessageSquare className="w-5 h-5" />
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-text-main group-hover:text-primary">{template.name}</h4>
                                            {template.metadata?.department && (
                                                <p className="text-xs text-text-muted mt-1">
                                                    {template.metadata.department[0].toUpperCase()}{template.metadata.department.slice(1)}
                                                </p>
                                            )}
                                            <p className="text-xs text-text-muted mt-1 opacity-70">
                                                {template.language || 'English'}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                                {templates && templates.length === 0 && (
                                    <div className="text-center py-10 text-text-muted">
                                        No agents available
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="flex px-2 flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                    <button
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Back to Agents
                    </button>

                    <div className="flex-1">
                        <div className="mb-6 p-4 bg-bg-alt rounded-2xl border border-border-subtle flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                <BotMessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-text-main">{selectedTemplate?.name}</h3>
                                <p className="text-sm text-text-muted">Select a phone number for this agent</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                Select Number
                            </h4>
                            {
                                phoneNumbersLoading ? (
                                    <div className="flex items-center w-full">
                                        <Skeleton className="w-full h-10 rounded-lg animate-pulse" />
                                    </div>
                                ) : (
                                    <Select
                                        onValueChange={(value) => setSelectedPhoneNumber(value)}
                                        value={selectedPhoneNumber}
                                    >
                                        <SelectTrigger className="w-full bg-background border-border-subtle h-12">
                                            <SelectValue placeholder="Select a number to link..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {phoneNumbers && phoneNumbers.length > 0 ? (
                                                phoneNumbers.map((number: any) => (
                                                    <SelectItem key={number.id} value={number.id}>
                                                        {number.number}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-xs text-center text-text-muted">
                                                    No unassigned numbers available
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )
                            }
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border-subtle">
                        <button
                            onClick={confirmAssignment}
                            disabled={assignLoading || !selectedPhoneNumber}
                            className="btn btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {assignLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-5 h-5" />
                            )}
                            {assignLoading ? "Processing..." : "Assign Agent"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CustomerAssignAgent