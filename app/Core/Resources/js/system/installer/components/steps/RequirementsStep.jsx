import React, { useEffect, useState } from 'react';
import { __ } from '@/common/lib/i18n';
import { Button } from "@ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function RequirementsStep({ onNext }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async () => {
            const req = await axios.get('/install/requirements');
            const perm = await axios.get('/install/permissions');
            setData({ ...req.data, permissions: perm.data });
            setLoading(false);
        };
        check();
    }, []);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    const canProceed = data.php.supported && 
                       Object.values(data.extensions).every(v => v) &&
                       Object.values(data.permissions).every(v => v.is_writable);

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <h3 className="font-medium text-sm text-zinc-500 uppercase">{__('php_extensions')}</h3>
                {Object.entries(data.extensions).map(([ext, supported]) => (
                    <div key={ext} className="flex justify-between items-center text-sm">
                        <span>{ext}</span>
                        {supported ? <CheckCircle2 className="text-green-500 w-4" /> : <XCircle className="text-red-500 w-4" />}
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                <h3 className="font-medium text-sm text-zinc-500 uppercase">{__('folder_permissions')}</h3>
                {Object.entries(data.permissions).map(([path, status]) => (
                    <div key={path} className="flex justify-between items-center text-sm">
                        <span>{path}</span>
                        {status.is_writable ? <CheckCircle2 className="text-green-500 w-4" /> : <XCircle className="text-red-500 w-4" />}
                    </div>
                ))}
            </div>

            <Button onClick={onNext} className="w-full cursor-pointer" disabled={!canProceed}>
                {canProceed ? __('continue') : __('fix_errors')}
            </Button>
        </div>
    );
}