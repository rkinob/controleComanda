import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { PushNotificationService, Notification } from '../../services/push-notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  showDropdown = false;
  private notificationsSubscription: Subscription = new Subscription();
  private unreadCountSubscription: Subscription = new Subscription();

  constructor(
    private notificationService: PushNotificationService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.notificationsSubscription = this.notificationService.getNotifications()
      .subscribe(notifications => {
        this.notifications = notifications;
      });

    this.unreadCountSubscription = this.notificationService.getUnreadCount()
      .subscribe(count => {
        this.unreadCount = count;
      });
  }

  ngOnDestroy(): void {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    if (this.unreadCountSubscription) {
      this.unreadCountSubscription.unsubscribe();
    }
  }

  // Listener para cliques fora do componente
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Verifica se o clique foi fora do componente
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeDropdown();
    }
  }

  // Listener para tecla Escape
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeDropdown();
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  markAsRead(notification: Notification): void {
    console.log(`[NotificationBell] Marcando notificação #${notification.id} como lida`);

    this.notificationService.markAsRead(notification.id).subscribe({
      next: (response) => {
        console.log(`[NotificationBell] Notificação #${notification.id} marcada como lida com sucesso`, response);
        // Atualiza localmente para feedback imediato
        notification.lida = true;
      },
      error: (error) => {
        console.error(`[NotificationBell] Erro ao marcar notificação #${notification.id} como lida:`, error);
      }
    });
  }

  markAllAsRead(): void {
    console.log('[NotificationBell] Marcando todas as notificações como lidas');

    this.notificationService.markAllAsRead().subscribe({
      next: (response) => {
        console.log('[NotificationBell] Todas as notificações marcadas como lidas com sucesso', response);
        // Atualiza localmente para feedback imediato
        this.notifications.forEach(notification => {
          notification.lida = true;
        });
      },
      error: (error) => {
        console.error('[NotificationBell] Erro ao marcar todas as notificações como lidas:', error);
      }
    });
  }

  getNotificationIcon(acao: string): string {
    switch (acao) {
      case 'confirmado':
        return '✅';
      case 'cancelado':
        return '❌';
      case 'preparando':
        return '👨‍🍳';
      case 'entregue':
        return '🚚';
      case 'fechada':
        return '🔒';
      default:
        return '📢';
    }
  }

  getNotificationClass(acao: string): string {
    switch (acao) {
      case 'confirmado':
        return 'notification-success';
      case 'cancelado':
        return 'notification-error';
      case 'preparando':
        return 'notification-warning';
      case 'entregue':
        return 'notification-success';
      case 'fechada':
        return 'notification-info';
      default:
        return 'notification-default';
    }
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Agora mesmo';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  }
}
