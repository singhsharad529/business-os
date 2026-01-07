import { useState, useEffect } from "react";
import voiceBotService from "@/api/voicebotService";
import { toast } from "@/hooks/useToast";
import axios, { AxiosRequestConfig } from "axios";
import { Skeleton } from "../ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { QuickAgentSetupRequest } from "@/types/voicebotTypes";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NewAgentProps {
    onCancel?: () => void;
    getAllAgents?: () => void;
}

interface AgentRole {
    value: string;
    label: string;
    description: string;
}

interface Language {
    value: string;
    label: string;
    description: string;
}

interface Configuration {
    value: string;
    label: string;
    description: string;
}


interface Number {
    id: string;
    vapiId: string;
    orgId: string;
    provider: string;
    number: string;
    credentialId: string;
    assistantId: string;
    name: string;
    status: string;
    twilioAccountSid: string;
    twilioAuthToken: string;
    createdAt: string;
    updatedAt: string;
}

function NewAgent({ onCancel, getAllAgents }: NewAgentProps) {


    const [agentRole, setAgentRole] = useState<AgentRole[]>([]);
    const [configurations, setConfigurations] = useState<Configuration[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [numbers, setNumbers] = useState<Number[]>([]);
    const [dataLoading, setDataLoading] = useState<boolean>(false);
    const [confiLoading, setConfigLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        agentRole: "",
        configuration: "",
        language: "",
        phoneNumberId: "",
    });

    const getAllAgentData = async () => {
        try {
            setDataLoading(true);

            const [agentRoles, agentLanguages, numbers] = await axios.all([
                voiceBotService.getAgentRoles({}),
                voiceBotService.getAgentLanguages({}),
                voiceBotService.getNumbers({}),
            ]);

            // console.log(agentRoles, agentLanguages, numbers);
            setAgentRole(agentRoles.agentRoles);
            setLanguages(agentLanguages.languages);
            setNumbers(numbers.unassignedPhoneNumbers);

        } catch (error) {
            console.error("Error fetching agents:", error);
            toast.danger("Failed to load agent roles. Please try again.");
        }
        setDataLoading(false);
    };

    const getAllConfigurations = async () => {
        try {
            setConfigLoading(true);
            const params: AxiosRequestConfig = {
                params: {
                    agentRole: formData.agentRole,
                },
            };
            const response = await voiceBotService.getConfiguration(params);
            console.log("repsonse", response);
            setConfigurations(response.configurations);
        } catch (error) {
            toast.danger("Failed to load agent configurations. Please try again.");
        }
        setConfigLoading(false);
    };

    useEffect(() => {

        getAllAgentData();
    }, []);


    useEffect(() => {
        if (formData.agentRole) {
            getAllConfigurations();
        }
    }, [formData.agentRole])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('formdata', formData);

        if (!formData.agentRole || !formData.configuration || !formData.language || !formData.phoneNumberId) {
            toast.danger("Please fill all the fields.");

            return;
        }

        const submitFormRequest: QuickAgentSetupRequest = {
            agentRole: formData.agentRole,
            configuration: formData.configuration,
            language: formData.language,
            phoneNumberId: formData.phoneNumberId,
        };

        try {
            setSubmitLoading(true);
            const response = await voiceBotService.createQuickAgent(submitFormRequest, {});
            toast.success(response.message);
            onCancel?.();
            getAllAgents?.();
        } catch (error) {
            console.error("Error creating agent:", error);
            toast.danger("Failed to create agent. Please try again.");
        }
        setSubmitLoading(false);

    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-text-main border-b border-border-subtle pb-2">
                    Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                    <div>
                        <label className="text-xs font-medium text-text-main mb-1 block">
                            Agent Role <span className="text-danger">*</span>
                        </label>
                        {
                            dataLoading ? (
                                <Skeleton className="h-10" />
                            ) : (
                                <Select
                                    value={formData.agentRole}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, agentRole: value }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agentRole.map((role: AgentRole) => (
                                            <SelectItem key={role.value} value={role.value} >
                                                <div className="flex flex-col text-left">
                                                    <span className="font-normal">{role.label}</span>
                                                    {role.description && (
                                                        <span className="text-xs">
                                                            {role.description.length > 30
                                                                ? `${role.description.substring(0, 30)}...`
                                                                : role.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )
                        }
                    </div>

                    <div>
                        <label className="text-xs font-medium text-text-main mb-1 block">
                            Configuration <span className="text-danger">*</span>
                        </label>
                        {
                            (dataLoading || confiLoading) ? (
                                <Skeleton className="h-10" />
                            ) : (
                                <Select
                                    value={formData.configuration}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, configuration: value }))}
                                    disabled={!formData.agentRole}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={formData.agentRole ? "Select Configuration" : "Select Role first"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {configurations.map((config: Configuration) => (
                                            <SelectItem key={config.value} value={config.value}>
                                                <div className="flex flex-col text-left">
                                                    <span className="font-medium">{config.label}</span>
                                                    {config.description && (
                                                        <span className="text-xs">
                                                            {config.description.length > 35
                                                                ? `${config.description.substring(0, 35)}...`
                                                                : config.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )
                        }
                    </div>

                    <div>
                        <label className="text-xs font-medium text-text-main mb-1 block">Language</label>
                        {
                            dataLoading ? (
                                <Skeleton className="h-10" />
                            ) : (
                                <Select
                                    value={formData.language}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map((lang: Language) => (
                                            <SelectItem key={lang.value} value={lang.value}>
                                                {lang.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )
                        }
                    </div>
                    <div>
                        <label className="text-xs font-medium text-text-main mb-1 block">Number</label>
                        {
                            dataLoading ? (
                                <Skeleton className="h-10" />
                            ) : (
                                <Select
                                    value={formData.phoneNumberId}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, phoneNumberId: value }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Number" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {numbers.map((number: Number) => (
                                            <SelectItem key={number.id} value={number.vapiId}>
                                                {number.number}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )
                        }
                    </div>

                </div>
            </div>

            <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1 rounded-xl">
                    {submitLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Agent"}
                </button>
                <button type="button"
                    className="btn btn-secondary rounded-xl"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default NewAgent;
