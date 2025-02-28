/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

// utils/logger.ts
/**
 * log. console.log (when developing).
 */
export class ELLogger {
	private readonly isEnabled: boolean;

	constructor({ isDev }: { isDev: boolean }) {
		this.isEnabled = isDev;
	}

	log(message: string, ...args: unknown[]): void {
		this.innerLog('log', message, ...args);
	}

	warn(message: string, ...args: unknown[]): void {
		this.innerLog('warn', message, ...args);
	}

	private innerLog(severity: 'log' | 'warn', message: string, ...args: unknown[]): void {
		if (!this.isEnabled) {
			return;
		}

		if (args.length) {
			console[severity](message, args);
		} else {
			console[severity](message);
		}
	}
}
