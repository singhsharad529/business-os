import { useState, useEffect } from "react";
import {
    agentConfigurations,
    agentRoles,
    agentLanguages,
    agentRegions,
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
                        <label className="text-xs font-medium text-text-main mb-1 block">Region</label>
                        <select
                            name="region"
                            value={formData.region}
                            onChange={handleChange}
                            className="input"
                        >
                            <option value="">Select Region</option>
                            {agentRegions.map((region) => (
                                <option key={region} value={region}>
                                    {region}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            </div>

            {/* Business Context Section */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-text-main border-b border-border-subtle pb-2">
                    Business Context
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-text-main mb-1 block">Website Name</label>
                        <input
                            type="text"
                            name="websiteName"
                            value={formData.websiteName}
                            onChange={handleChange}
                            className="input"
                            placeholder="e.g. Acme Corp"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-text-main mb-1 block">Domain</label>
                        <input
                            type="text"
                            name="domain"
                            value={formData.domain}
                            onChange={handleChange}
                            className="input"
                            placeholder="e.g. acme.com"
                        />
                    </div>
                </div>
            </div>

            {/* Custom Context Section */}
            <div className="space-y-4 pt-2">
                <h3 className="text-sm font-semibold text-text-main border-b border-border-subtle pb-2">
                    Custom Context
                </h3>
                <div>
                    <label className="text-xs font-medium text-text-main mb-1 block">
                        Knowledge Base / Instructions
                    </label>
                    <textarea
                        name="customContext"
                        value={formData.customContext}
                        onChange={handleChange}
                        className="input min-h-[100px] resize-none"
                        placeholder="Describe your products, services, policies, or FAQs here..."
                    />
                    <p className="text-[10px] text-text-muted mt-1 italic">
                        This information will be used by the agent to answer customer queries.
                    </p>
                </div>
            </div>

            <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1">
                    {agent ? "Update Agent" : "Create Agent"}
                </button>
                <button type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default NewAgent;
