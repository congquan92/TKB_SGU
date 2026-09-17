/*
 * Copyright (C) 2026 Nguyen Cong Quan
 * Kênh Thông Báo Dạng Group Chat (Hỗ trợ Full-Screen trên Mobile Native & Popover trên Desktop)
 */
import { useState, useEffect, useMemo, useRef } from "react";
import {
    Bell,
    CheckCircle2,
    Pin,
    ExternalLink,
    Sparkles,
    Users,
    X,
    ChevronLeft,
    ChevronRight,
    CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hook/useIsMobile";
import rawNotifications from "@/data/notifcation.json";

export interface NotificationItem {
    id: string;
    title: string;
    content: string;
    tags?: string[];
    link?: {
        label: string;
        url: string;
    } | null;
    timestamp: string;
    pinned?: boolean;
    sender?: {
        name: string;
        role: string;
        avatar?: string;
    };
}

const STORAGE_READ_KEY = "sgu_tkb_read_notifications";

function isImageUrl(url?: string): boolean {
    if (!url) return false;
    return (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("/") ||
        url.startsWith("./") ||
        url.startsWith("data:image")
    );
}

function formatTimeOnly(dateString: string): string {
    try {
        const date = new Date(dateString);
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    } catch {
        return "";
    }
}

function formatDateHeader(dateString: string): string {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        if (isToday) return "Hôm nay";

        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        const isYesterday =
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();

        if (isYesterday) return "Hôm qua";

        const d = date.getDate().toString().padStart(2, "0");
        const m = (date.getMonth() + 1).toString().padStart(2, "0");
        const y = date.getFullYear();
        return `${d} tháng ${m}, ${y}`;
    } catch {
        return dateString;
    }
}

const notifications = (rawNotifications as NotificationItem[]) || [];

export default function Notify() {
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const [readIds, setReadIds] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_READ_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [showPinnedBanner, setShowPinnedBanner] = useState(true);
    const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);
    const [highlightedId, setHighlightedId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_READ_KEY, JSON.stringify(readIds));
        } catch (e) {
            console.error(e);
        }
    }, [readIds]);

    // Tự động cuộn xuống dưới cùng khi mở khung chat
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 80);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const markAsRead = (id: string) => {
        if (!readIds.includes(id)) {
            setReadIds((prev) => [...prev, id]);
        }
    };

    const scrollToMessage = (messageId: string) => {
        const el = document.getElementById(`msg-${messageId}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            setHighlightedId(messageId);
            markAsRead(messageId);
            setTimeout(() => {
                setHighlightedId(null);
            }, 2500);
        }
    };

    const markAllAsRead = () => {
        const allIds = notifications.map((item) => item.id);
        setReadIds(allIds);
    };

    const unreadCount = useMemo(() => {
        return notifications.filter((item) => !readIds.includes(item.id)).length;
    }, [notifications, readIds]);

    // Sắp xếp theo trình tự thời gian tăng dần (cũ ở trên, mới ở dưới như đoạn chat)
    const sortedNotifications = useMemo(() => {
        return [...notifications].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    }, [notifications]);

    // Danh sách các tin nhắn đã ghim từ file JSON
    const pinnedItems = useMemo(() => {
        return notifications.filter((n) => n.pinned);
    }, [notifications]);

    const activePinnedIndex =
        pinnedItems.length > 0 ? currentPinnedIndex % pinnedItems.length : 0;
    const currentPinnedItem = pinnedItems[activePinnedIndex];

    // Nội dung toàn bộ cửa sổ chat nhóm
    const ChatContent = (
        <div className="flex flex-col h-full w-full bg-background overflow-hidden">
            {/* Header Đoạn Chat Nhóm (Messenger Style) */}
            <div className="bg-card px-4 py-3 sm:px-6 sm:py-4 border-b border-border/80 flex items-center justify-between gap-3 shadow-xs shrink-0">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    {/* Avatar Nhóm */}
                    <div className="relative shrink-0">
                        <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 p-[2px] shadow-sm">
                            <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-bold text-sm sm:text-base text-rose-600 dark:text-rose-400">
                                SGU
                            </div>
                        </div>
                        <div
                            className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-500 ring-2 ring-background flex items-center justify-center text-[7px] sm:text-[9px] text-white font-bold"
                            title="Đang hoạt động"
                        >
                            ✓
                        </div>
                    </div>

                    {/* Tiêu đề & Thông tin Nhóm */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <h3 className="font-bold text-sm sm:text-lg text-foreground truncate tracking-tight">
                                Thông Báo & Cập Nhật TKB SGU
                            </h3>
                            <span title="Kênh xác thực" className="inline-flex items-center">
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 fill-sky-500 text-background shrink-0" />
                            </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1.5 truncate mt-0.5">
                            <span className="font-medium text-foreground/85">Quản trị viên</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Sinh viên SGU
                            </span>
                        </p>
                    </div>
                </div>

                {/* Actions trên Header: Đánh dấu đã đọc tất cả & Nút đóng trên Mobile */}
                <div className="flex items-center gap-1.5 shrink-0">
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-md border border-rose-500/20 transition-colors cursor-pointer shadow-xs"
                            title="Đánh dấu tất cả là đã đọc"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Đã đọc tất cả</span>
                        </button>
                    )}

                    {/* Nút đóng trên Mobile */}
                    {isMobile && (
                        <button
                            onClick={() => setOpen(false)}
                            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                            title="Đóng thông báo"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Banner Tin Nhắn Đã Ghim (Hỗ trợ duyệt nhiều tin ghim) */}
            {pinnedItems.length > 0 && currentPinnedItem && showPinnedBanner && (
                <div className="bg-rose-500/10 dark:bg-rose-950/40 px-3 py-2 sm:px-5 sm:py-2.5 border-b border-rose-500/20 flex items-center justify-between gap-2 text-xs sm:text-sm shrink-0 transition-colors">
                    {/* Phần nội dung có thể click để cuộn tới tin nhắn và chuyển tiếp tin ghim */}
                    <div
                        onClick={() => {
                            scrollToMessage(currentPinnedItem.id);
                            if (pinnedItems.length > 1) {
                                setCurrentPinnedIndex((prev) => (prev + 1) % pinnedItems.length);
                            }
                        }}
                        className="flex-1 flex items-center gap-2 min-w-0 cursor-pointer hover:opacity-85 transition-opacity group"
                        title={
                            pinnedItems.length > 1
                                ? "Nhấn để cuộn đến tin này và chuyển sang tin ghim tiếp theo"
                                : "Nhấn để cuộn đến tin nhắn đã ghim"
                        }
                    >
                        <Pin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 shrink-0 fill-rose-500/40 group-hover:scale-110 transition-transform" />
                        <div className="truncate flex items-center gap-1.5 min-w-0">
                            <span className="font-semibold text-rose-600 dark:text-rose-400 shrink-0 whitespace-nowrap">
                                {pinnedItems.length > 1
                                    ? `Tin đã ghim (${activePinnedIndex + 1}/${pinnedItems.length}):`
                                    : "Tin đã ghim:"}
                            </span>
                            <span className="text-foreground/90 group-hover:underline decoration-rose-500/50 underline-offset-2 truncate">
                                {currentPinnedItem.title}
                            </span>
                        </div>
                    </div>

                    {/* Điều hướng chuyển tin ghim & Nút ẩn ghim */}
                    <div className="flex items-center gap-1 shrink-0">
                        {pinnedItems.length > 1 && (
                            <div className="flex items-center gap-0.5 mr-0.5 bg-rose-500/15 dark:bg-rose-900/40 rounded-md p-0.5 border border-rose-500/20">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const prev = (activePinnedIndex - 1 + pinnedItems.length) % pinnedItems.length;
                                        setCurrentPinnedIndex(prev);
                                        scrollToMessage(pinnedItems[prev].id);
                                    }}
                                    className="p-1 rounded hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                                    title="Tin ghim trước"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 px-1 select-none">
                                    {activePinnedIndex + 1}/{pinnedItems.length}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const next = (activePinnedIndex + 1) % pinnedItems.length;
                                        setCurrentPinnedIndex(next);
                                        scrollToMessage(pinnedItems[next].id);
                                    }}
                                    className="p-1 rounded hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                                    title="Tin ghim tiếp theo"
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => setShowPinnedBanner(false)}
                            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-rose-500/10 cursor-pointer shrink-0 transition-colors"
                            title="Ẩn ghim"
                        >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Danh Sách Tin Nhắn Trong Đoạn Chat */}
            <ScrollArea className="flex-1 min-h-0 h-full p-3 sm:p-6 bg-zinc-50/70 dark:bg-zinc-950/60 overflow-x-hidden">
                {sortedNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground space-y-2">
                        <div className="p-4 bg-muted rounded-full">
                            <Sparkles className="w-8 h-8 text-muted-foreground/60" />
                        </div>
                        <p className="text-base font-semibold text-foreground">Không có tin nhắn nào</p>
                        <p className="text-xs text-muted-foreground">Chưa có thông báo nào trong file json.</p>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-6">
                        {sortedNotifications.map((item, index) => {
                            const isUnread = !readIds.includes(item.id);
                            const isHighlighted = highlightedId === item.id;
                            const avatarSrc = item.sender?.avatar;
                            const hasImageUrl = isImageUrl(avatarSrc);

                            const showDateHeader =
                                index === 0 ||
                                formatDateHeader(item.timestamp) !==
                                    formatDateHeader(sortedNotifications[index - 1].timestamp);

                            return (
                                <div key={item.id} id={`msg-${item.id}`} className="space-y-2 sm:space-y-3 scroll-mt-4">
                                    {/* Dòng Phân Cách Ngày */}
                                    {showDateHeader && (
                                        <div className="flex items-center justify-center my-3 sm:my-4">
                                            <div className="bg-background/90 dark:bg-zinc-800/90 border border-border/70 px-3.5 py-0.5 sm:px-4 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold text-muted-foreground shadow-xs">
                                                {formatDateHeader(item.timestamp)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Từng Bong Bóng Tin Nhắn */}
                                    <div
                                        onClick={() => markAsRead(item.id)}
                                        className="flex items-start gap-2.5 sm:gap-3.5 group cursor-pointer w-full min-w-0"
                                    >
                                        {/* Avatar Người Gửi (Hỗ trợ URL ảnh hoặc Chữ cái) */}
                                        <div className="relative shrink-0 mt-0.5">
                                            {hasImageUrl ? (
                                                <img
                                                    src={avatarSrc}
                                                    alt={item.sender?.name || "Avatar"}
                                                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-full object-cover shadow-xs border border-border/80 ring-1 ring-border/50"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = "none";
                                                        const fallback = target.nextElementSibling as HTMLElement;
                                                        if (fallback) fallback.style.display = "flex";
                                                    }}
                                                />
                                            ) : null}

                                            <div
                                                className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center text-white text-xs sm:text-base font-bold shadow-xs ${
                                                    hasImageUrl ? "hidden" : "flex"
                                                }`}
                                            >
                                                {avatarSrc || "Q"}
                                            </div>
                                        </div>

                                        {/* Thân Tin Nhắn */}
                                        <div className="flex-1 min-w-0">
                                            {/* Header Tin Nhắn (Tên, Role, Giờ từ JSON) */}
                                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 pl-0.5 flex-wrap">
                                                <span className="font-semibold text-xs sm:text-sm text-foreground">
                                                    {item.sender?.name || "Nguyễn Công Quân"}
                                                </span>
                                                {item.sender?.role && (
                                                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20">
                                                        {item.sender.role}
                                                    </span>
                                                )}
                                                <span className="text-[11px] text-muted-foreground font-mono">
                                                    {formatTimeOnly(item.timestamp)}
                                                </span>
                                                {isUnread && (
                                                    <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                                                        Mới
                                                    </span>
                                                )}
                                            </div>

                                            {/* Bong Bóng Chat */}
                                            <div
                                                className={`relative rounded-2xl rounded-tl-xs p-3 sm:p-4.5 transition-all duration-300 border break-words [overflow-wrap:anywhere] ${
                                                    isHighlighted
                                                        ? "bg-rose-500/15 dark:bg-rose-950/60 border-rose-500 ring-4 ring-rose-500/30 scale-[1.01] shadow-xl"
                                                        : isUnread
                                                        ? "bg-card border-rose-500/40 ring-2 ring-rose-500/20 shadow-md"
                                                        : "bg-card hover:bg-muted/40 border-border/80 shadow-xs"
                                                }`}
                                            >
                                                {/* Pinned Tag nếu item.pinned là true */}
                                                {item.pinned && (
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 mb-2 pb-1.5 border-b border-border/50">
                                                        <Pin className="w-3.5 h-3.5 fill-rose-500" />
                                                        <span>Thông báo quan trọng đã ghim</span>
                                                    </div>
                                                )}

                                                {/* Tiêu Đề */}
                                                <h4 className="font-bold text-sm sm:text-base text-foreground leading-snug tracking-tight mb-1.5 break-words">
                                                    {item.title}
                                                </h4>

                                                {/* Nội Dung */}
                                                <p className="text-xs sm:text-sm text-foreground/90 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-normal break-words">
                                                    {item.content}
                                                </p>

                                                {/* Tags Hashtag từ JSON */}
                                                {item.tags && item.tags.length > 0 && (
                                                    <div className="flex items-center gap-1.5 flex-wrap mt-2.5 sm:mt-3">
                                                        {item.tags.map((tag, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Link Đính Kèm từ JSON (nếu có) */}
                                                {item.link && item.link.url && (
                                                    <div className="mt-3 sm:mt-3.5">
                                                        <a
                                                            href={item.link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-xl bg-muted/60 hover:bg-muted/90 transition-all border border-border group/link"
                                                        >
                                                            <div className="min-w-0 flex-1">
                                                                <div className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                                                    Liên kết đính kèm
                                                                </div>
                                                                <div className="text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 truncate">
                                                                    {item.link.label || item.link.url}
                                                                </div>
                                                            </div>
                                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-background flex items-center justify-center shadow-xs group-hover/link:scale-110 transition-transform shrink-0">
                                                                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
                                                            </div>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Điểm neo để tự động cuộn xuống dưới cùng khi mở */}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </ScrollArea>
        </div>
    );

    const TriggerButton = (
        <Button
            variant="outline"
            size="icon"
            className="relative size-8 rounded-none transition-all duration-300 
            border-rose-200 bg-white text-rose-500
            hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300
            dark:bg-zinc-950 dark:border-rose-900/40 dark:text-rose-400
            dark:hover:bg-rose-950/30 dark:hover:border-rose-700 dark:hover:text-rose-300 cursor-pointer group"
            title={
                unreadCount > 0
                    ? `Thông báo TKB SGU (${unreadCount} tin nhắn chưa đọc)`
                    : "Thông báo & Cập nhật TKB SGU"
            }
        >
            <Bell className="h-[1.2rem] w-[1.2rem] transition-transform duration-200 group-hover:scale-110" />

            {/* Huy hiệu hiển thị tin nhắn chưa đọc */}
            {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center">
                    {/* Hiệu ứng xung nhịp viền */}
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-60 pointer-events-none" />

                    {/* Badge số lượng tin chưa đọc */}
                    <span className="relative inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full ring-2 ring-background shadow-xs pointer-events-none leading-none tabular-nums">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                </span>
            )}
        </Button>
    );

    // Trên Mobile Native: Mở Full-screen Dialog chuyên biệt như app chat thật
    if (isMobile) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {TriggerButton}
                </DialogTrigger>
                <DialogContent
                    showCloseButton={false}
                    className="fixed inset-0 z-50 max-w-full w-full h-[100dvh] p-0 border-0 rounded-none bg-background flex flex-col overflow-hidden translate-x-0 translate-y-0 top-0 left-0"
                >
                    {ChatContent}
                </DialogContent>
            </Dialog>
        );
    }

    // Trên Desktop: Mở dạng Popover Panel rộng rãi thả xuống từ Header
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {TriggerButton}
            </PopoverTrigger>
            <PopoverContent
                align="end"
                sideOffset={8}
                className="w-[720px] md:w-[780px] max-w-[820px] p-0 rounded-2xl shadow-2xl border border-border/80 bg-background overflow-hidden z-50 duration-200 will-change-[transform,opacity] flex flex-col h-[650px]"
            >
                {ChatContent}
            </PopoverContent>
        </Popover>
    );
}
