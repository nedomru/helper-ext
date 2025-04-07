const maxLogSize = 10000; // Maximum number of log entries to keep
const logLevels = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    DEBUG: 'debug'
};

async function log(level, message, module = '') {
    try {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            module,
            message
        };

        // Get existing logs
        const { logs = [] } = await browser.storage.local.get('logs');
        
        // Add new log entry
        logs.push(logEntry);
        
        // Trim logs if they exceed max size
        if (logs.length > maxLogSize) {
            logs.splice(0, logs.length - maxLogSize);
        }
        
        // Save updated logs
        await browser.storage.local.set({ logs });
        
        // Also log to console for immediate feedback
        const consoleMethod = level === logLevels.ERROR ? 'error' : 
                            level === logLevels.WARN ? 'warn' : 
                            level === logLevels.DEBUG ? 'debug' : 'info';
        
        console[consoleMethod](`[${timestamp}] [Хелпер]${module ? ` - [${module}]` : ''} ${message}`);
    } catch (error) {
        error('Error in logger:', error);
    }
}

async function getLogs() {
    try {
        const { logs = [] } = await browser.storage.local.get('logs');
        return logs;
    } catch (error) {
        error('Error getting logs:', error);
        return [];
    }
}

async function clearLogs() {
    try {
        await browser.storage.local.set({ logs: [] });
    } catch (error) {
        error('Error clearing logs:', error);
    }
}

async function downloadLogs() {
    try {
        const logs = await getLogs();
        const logText = logs.map(log => 
            `[${log.timestamp}] [${log.level}]${log.module ? ` [${log.module}]` : ''} ${log.message}`
        ).join('\n');
        
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `helper-logs-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        error('Error downloading logs:', error);
    }
}

// Convenience functions for different log levels
function info(message, module = '') {
    return log(logLevels.INFO, message, module);
}

function warn(message, module = '') {
    return log(logLevels.WARN, message, module);
}

function error(message, module = '') {
    return log(logLevels.ERROR, message, module);
}

function debug(message, module = '') {
    return log(logLevels.DEBUG, message, module);
}