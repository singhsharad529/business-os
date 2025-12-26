import { useState, useEffect } from "react";
import voiceBotService from "@/api/voicebotService";
import { toast } from "@/hooks/useToast";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface EditAgentProps {
    agent: any;
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface Item {
    value: string;
    label: string;
    description?: string;
}

interface Number {
    id: string;
    vapiId: string;
    number: string;
}

function EditAgent({ agent, onSuccess, onCancel }: EditAgentProps) {
    const [agentRole, setAgentRole] = useState<Item[]>([]);
    const [configurations, setConfigurations] = useState<Item[]>([]);
    const [languages, setLanguages] = useState<Item[]>([]);
    const [numbers, setNumbers] = useState<Number[]>([]);
    const [dataLoading, setDataLoading] = useState<boolean>(false);
    const [confiLoading, setConfigLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        name: agent?.name || "",
        agentRole: agent?.metadata?.department || "",
        configuration: agent?.name || "",
        language: agent?.metadata?.language || "",
        phoneNumberId: agent?.phoneNumbers?.[0]?.vapiId || "",
    });

    useEffect(() => {
        const getAllAgentData = async () => {
            try {
                setDataLoading(true);
                const [rolesRes, langsRes, numsRes] = await axios.all([
                    voiceBotService.getAgentRoles({}),
                    voiceBotService.getAgentLanguages({}),
                    voiceBotService.getNumbers({}),
                ]);

                setAgentRole(rolesRes.agentRoles || []);
                setLanguages(langsRes.languages || []);
                setNumbers(numsRes.unassignedPhoneNumbers || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.danger("Failed to load form data.");
            } finally {
                setDataLoading(false);
            }
        };

        getAllAgentData();
    }, []);

    useEffect(() => {
        const getConfigurations = async () => {
            if (!formData.agentRole) return;
            try {
                setConfigLoading(true);
                const response = await voiceBotService.getConfiguration({
                    params: { agentRole: formData.agentRole },
                });
                setConfigurations(response.configurations || []);
            } catch (error) {
                console.error("Error fetching configurations:", error);
            } finally {
                setConfigLoading(false);
            }
        };

        getConfigurations();
    }, [formData.agentRole]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agent?.vapiId) {
            toast.danger("Agent ID not found.");
            return;
        }

        try {
            setSubmitLoading(true);
            const updateData = {
                name: formData.name,
                agentRole: formData.agentRole,
                configuration: formData.configuration,
                language: formData.language,
                phoneNumberId: formData.phoneNumberId,
            };

            const response = await voiceBotService.updateAgent(agent.vapiId, updateData, {});
            toast.success(response.message || "Agent updated successfully");
            onSuccess?.();
        } catch (error) {
            console.error("Error updating agent:", error);
            toast.danger("Failed to update agent. Please try again.");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-text-main border-b border-border-subtle pb-2">
                    Agent Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                        <label className="text-xs font-medium text-text-main mb-1 block">
                            Agent Role <span className="text-danger">*</span>
                        </label>
                        {dataLoading ? (
                            <Skeleton className="h-10" />
                        ) : (
                            <Select
                                value={formData.agentRole}
                                onValueChange={(value) => setFormData(p => ({ ...p, agentRole: value }))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {agentRole.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-medium text-text-main mb-1 block">
                            Configuration <span className="text-danger">*</span>
                        </label>
                        {dataLoading || confiLoading ? (
                            <Skeleton className="h-10" />
                        ) : (
                            <Select
                                value={formData.configuration}
                                onValueChange={(value) => setFormData(p => ({ ...p, configuration: value }))}
                                disabled={!formData.agentRole}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={formData.agentRole ? "Select Configuration" : "Select Role first"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {configurations.map((config) => (
                                        <SelectItem key={config.value} value={config.value}>
                                            {config.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-medium text-text-main mb-1 block">Language</label>
                        {dataLoading ? (
                            <Skeleton className="h-10" />
                        ) : (
                            <Select
                                value={formData.language}
                                onValueChange={(value) => setFormData(p => ({ ...p, language: value }))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-medium text-text-main mb-1 block">Number</label>
                        {dataLoading ? (
                            <Skeleton className="h-10" />
                        ) : (
                            <Select
                                value={formData.phoneNumberId}
                                onValueChange={(value) => setFormData(p => ({ ...p, phoneNumberId: value }))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Number" />
                                </SelectTrigger>
                                <SelectContent>
                                    {numbers.map((number) => (
                                        <SelectItem key={number.id} value={number.vapiId}>
                                            {number.number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    className="btn btn-primary flex-1 rounded-xl"
                    disabled={submitLoading}
                >
                    {submitLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        "Update Agent"
                    )}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary rounded-xl"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default EditAgent;

