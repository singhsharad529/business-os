import { useState, useEffect } from "react";
import {
    agentConfigurations,
    agentRoles,
    agentLanguages,
    agentRegions,
    mobileNumbers,
} from "../../data/agentMockData";
import { Agent } from "../../types";

interface NewAgentProps {
    agent?: Agent;
    onSuccess?: (agent: Partial<Agent>) => void;
    onCancel?: () => void;
}

function NewAgent({ agent, onSuccess, onCancel }: NewAgentProps) {
    const [formData, setFormData] = useState({
        name: agent?.configuration.split(" - ")[1] || "", // Extracting name from config for demo
        configuration: agent?.configuration || "",
        role: agent?.configuration.split(" - ")[0] || "", // Extracting role from config for demo
        language: agent?.language || "",
        region: agent?.region || "",
        websiteName: agent?.websiteName || "",
        domain: agent?.domain || "",
        customContext: agent?.customContext || "",
        number: agent?.mobileNumber || "",
    });

    useEffect(() => {
        if (agent) {
            setFormData({
                name: agent.configuration.split(" - ")[1] || "",
                configuration: agent.configuration,
                role: agent.configuration.split(" - ")[0] || "",
                language: agent.language,
                region: agent.region,
                websiteName: agent.websiteName || "",
                domain: agent.domain || "",
                customContext: agent.customContext || "",
                number: agent.mobileNumber || "",
            });
        }
    }, [agent]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        if (onSuccess) {
            onSuccess(formData);
        }
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
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="input"
                            required
                        >
                            <option value="">Select Role</option>
                            {agentRoles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-text-main mb-1 block">
                            Configuration <span className="text-danger">*</span>
                        </label>
                        <select
                            name="configuration"
                            value={formData.configuration}
                            onChange={handleChange}
                            className="input"
                            required
                        >
                            <option value="">Select Configuration</option>
                            {agentConfigurations.map((config) => (
                                <option key={config} value={config}>
                                    {config}
                                </option>
                            ))}
                        </select>
                    </div>



                    <div>
                        <label className="text-xs font-medium text-text-main mb-1 block">Language</label>
                        <select
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            className="input"
                        >
                            <option value="">Select Language</option>
                            {agentLanguages.map((lang) => (
                                <option key={lang} value={lang}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-text-main mb-1 block">Number</label>
                        <select
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            className="input"
                        >
                            <option value="">Select Number</option>
                            {mobileNumbers.map((number) => (
                                <option key={number} value={number}>
                                    {number}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            </div>

            <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1 rounded-xl">
                    {agent ? "Update Agent" : "Create Agent"}
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
