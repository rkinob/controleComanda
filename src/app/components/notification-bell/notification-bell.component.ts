import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(private notificationService: PushNotificationService) {}

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

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  markAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification.id).subscribe(() => {
      // The service will automatically update the notifications
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      // The service will automatically update the notifications
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
