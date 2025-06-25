import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    constructor(
        private readonly mailerService: MailerService,
    ) {}

    async sendInvoiceEmail(dest: string[], username: string, invoice_category: string, invoice_amount: number, parcel: string, invoice_due_date: string) {
        const template = 'new-invoice';

        await this.mailerService.sendMail({
            to: dest,
            subject: 'Nota de Cobro Asignada - SmartPlot',
            template: template,
            context: {
                nombre_usuario: username,
                motivo_nota: invoice_category,
                monto: invoice_amount,
                parcela_asignada: parcel,
                fecha_vencimiento: new Date(invoice_due_date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }),
                current_year: new Date().getFullYear(),
            },
        });
        this.logger.log(`New invoice email sent to ${dest.join(', ')}`);
    }

    async sendExpiredInvoiceEmail(dest: string[], username: string, invoice_category: string, invoice_amount: number, parcel: string, invoice_due_date: string) {
        const template = 'expired-invoice';

        await this.mailerService.sendMail({
            to: dest,
            subject: 'Nota de Cobro Vencida - SmartPlot',
            template: template,
            context: {
                nombre_usuario: username,
                motivo_nota: invoice_category,
                monto: invoice_amount,
                parcela_asignada: parcel,
                fecha_vencimiento: new Date(invoice_due_date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }),
                current_year: new Date().getFullYear(),
            },
        });
        this.logger.log(`Expired invoice email sent to ${dest.join(', ')}`);
    }

    async sendPaymentSuccessEmail(dest: string[], username: string, invoice_category: string, invoice_amount: number, parcel: string, payment_date: Date, payment_reference: string, status: string, payment_method: string) {
        const template = 'payment-success';

        await this.mailerService.sendMail({
            to: dest,
            subject: 'Conirmación de Pago - SmartPlot',
            template: template,
            context: {
                nombre_usuario: username,
                motivo: invoice_category,
                monto: invoice_amount,
                parcela_asignada: parcel,
                fecha_pago: new Date(payment_date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }),
                referencia_pago: payment_reference,
                estado_pago: status,
                metodo_pago: payment_method,
                current_year: new Date().getFullYear(),
            },
        });
        this.logger.log(`Payment success email sent to ${dest.join(', ')}`);
    }


    async sendPaymentFailureEmail(dest: string[], username: string, invoice_amount: number, parcel: string, payment_date: Date, notes: string) {
        const template = 'payment-failed';

        await this.mailerService.sendMail({
            to: dest,
            subject: 'Error en el Pago - SmartPlot',
            template: template,
            context: {
                nombre_usuario: username,
                monto: invoice_amount,
                parcela_asignada: parcel,
                fecha_intento: new Date(payment_date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }),
                detalles: notes,
                current_year: new Date().getFullYear(),
            },
        });
        this.logger.log(`Payment failure email sent to ${dest.join(', ')}`);
    }

    async sendPendingPaymentNotification(dest: string[], username: string, invoice_category: string, invoice_amount: number, parcel: string, invoice_due_date: string) {
        const template = 'pending-payment';

        await this.mailerService.sendMail({
            to: dest,
            subject: 'Notificación de Pago Pendiente - SmartPlot',
            template: template,
            context: {
                nombre_usuario: username,
                motivo_pago: invoice_category,
                monto: invoice_amount,
                parcela_asignada: parcel,
                fecha_vencimiento: new Date(invoice_due_date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }),
                current_year: new Date().getFullYear(),
            },
        });
        this.logger.log(`Pending payment notification sent to ${dest.join(', ')}`);
    }
}
