// main.js - Orchestrator for dynamic role loading

const ROLES = [
    'CDev', 'DataAnalysis', 'dataAnalyst', 'DataEngineer', 
    'dataScience', 'erpDev', 'fullStack', 'itEngineer', 
    'JavaDev', 'netDeveloper', 'PyDev', 'webDev'
];

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Identify current role from URL
    const path = window.location.pathname.toLowerCase();
    const activeRoleName = ROLES.find(r => path.includes(`/${r.toLowerCase()}`)) || 'itEngineer';
    
    // 2. Dynamically import the role configuration module
    let activeRoleConfig = {};
    try {
        const module = await import(`./roles/${activeRoleName}.js`);
        activeRoleConfig = module.default || module;
        window.activeRoleConfig = activeRoleConfig;
    } catch (err) {
        console.warn(`[main.js] No se pudo cargar el rol ${activeRoleName}. Fallback a configuración por defecto.`, err);
    }

    // 3. Dynamic theme injection removed to standardize on global red theme
    // (Variables fall back to base.css defaults)

    // 4. Dispatch custom event to notify components that role configuration is loaded
    const event = new CustomEvent('roleLoaded', { detail: { role: activeRoleName, config: activeRoleConfig } });
    document.dispatchEvent(event);
});