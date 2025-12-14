import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, FileText, Mic, Bell, Plus, Trash2, Edit2, Save, X, Search, Upload, Download, Share2, Filter, Home, Clock } from 'lucide-react';

export default function PersonalAssistant() {
    const [activeTab, setActiveTab] = useState('home');
    const [calendar, setCalendar] = useState([]);
    const [todos, setTodos] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [calData, todoData, docData, noteData] = await Promise.all([
                window.storage.get('calendar-events').catch(() => null),
                window.storage.get('todo-lists').catch(() => null),
                window.storage.get('documents').catch(() => null),
                window.storage.get('notes').catch(() => null)
            ]);

            if (calData?.value) setCalendar(JSON.parse(calData.value));
            if (todoData?.value) setTodos(JSON.parse(todoData.value));
            if (docData?.value) setDocuments(JSON.parse(docData.value));
            if (noteData?.value) setNotes(JSON.parse(noteData.value));
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
        }
        setIsLoading(false);
    };

    const saveCalendar = async (data) => {
        try {
            await window.storage.set('calendar-events', JSON.stringify(data));
        } catch (error) {
            console.error('خطأ في حفظ المواعيد:', error);
        }
    };

    const saveTodos = async (data) => {
        try {
            await window.storage.set('todo-lists', JSON.stringify(data));
        } catch (error) {
            console.error('خطأ في حفظ المهام:', error);
        }
    };

    const saveDocuments = async (data) => {
        try {
            await window.storage.set('documents', JSON.stringify(data));
        } catch (error) {
            console.error('خطأ في حفظ المستندات:', error);
        }
    };

    const saveNotes = async (data) => {
        try {
            await window.storage.set('notes', JSON.stringify(data));
        } catch (error) {
            console.error('خطأ في حفظ الملاحظات:', error);
        }
    };

    // الصفحة الرئيسية - Dashboard
    const HomeComponent = () => {
        const upcomingEvents = calendar
            .filter(ev => new Date(ev.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);

        const incompleteTodos = todos.filter(list =>
            list.items.some(item => !item.completed)
        ).slice(0, 3);

        const recentNotes = [...notes]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);

        const todayDate = new Date().toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return (
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
                    <h2 className="text-3xl font-bold mb-2">مرحباً بك! 👋</h2>
                    <p className="text-lg opacity-90">{todayDate}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
                            <p className="text-3xl font-bold">{calendar.length}</p>
                            <p className="text-sm">موعد محفوظ</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
                            <p className="text-3xl font-bold">{todos.reduce((acc, list) => acc + list.items.length, 0)}</p>
                            <p className="text-sm">مهمة</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
                            <p className="text-3xl font-bold">{documents.length}</p>
                            <p className="text-sm">مستند</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
                            <p className="text-3xl font-bold">{notes.length}</p>
                            <p className="text-sm">ملاحظة</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => setActiveTab('calendar')}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center gap-3 hover:scale-105"
                    >
                        <div className="bg-blue-100 p-4 rounded-full">
                            <Calendar className="text-blue-600" size={32} />
                        </div>
                        <span className="font-semibold text-gray-700">إضافة موعد</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('todos')}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center gap-3 hover:scale-105"
                    >
                        <div className="bg-green-100 p-4 rounded-full">
                            <CheckSquare className="text-green-600" size={32} />
                        </div>
                        <span className="font-semibold text-gray-700">قائمة مهام</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center gap-3 hover:scale-105"
                    >
                        <div className="bg-purple-100 p-4 rounded-full">
                            <FileText className="text-purple-600" size={32} />
                        </div>
                        <span className="font-semibold text-gray-700">رفع مستند</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center gap-3 hover:scale-105"
                    >
                        <div className="bg-yellow-100 p-4 rounded-full">
                            <Mic className="text-yellow-600" size={32} />
                        </div>
                        <span className="font-semibold text-gray-700">ملاحظة جديدة</span>
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Upcoming Events */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">المواعيد القادمة</h3>
                            <Clock className="text-blue-500" size={24} />
                        </div>
                        {upcomingEvents.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">لا توجد مواعيد قادمة</p>
                        ) : (
                            <div className="space-y-3">
                                {upcomingEvents.map(event => (
                                    <div key={event.id} className="border-r-4 border-blue-500 bg-blue-50 p-3 rounded">
                                        <h4 className="font-bold text-gray-800">{event.title}</h4>
                                        <p className="text-sm text-gray-600">
                                            {new Date(event.date).toLocaleDateString('ar-EG')} {event.time && `- ${event.time}`}
                                        </p>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setActiveTab('calendar')}
                                    className="w-full text-blue-600 hover:text-blue-700 text-sm font-semibold mt-2"
                                >
                                    عرض كل المواعيد ←
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Todo Lists Preview */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">المهام النشطة</h3>
                            <CheckSquare className="text-green-500" size={24} />
                        </div>
                        {incompleteTodos.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">كل المهام مكتملة! 🎉</p>
                        ) : (
                            <div className="space-y-3">
                                {incompleteTodos.map(list => {
                                    const incomplete = list.items.filter(item => !item.completed).length;
                                    return (
                                        <div key={list.id} className="bg-green-50 p-3 rounded border-r-4 border-green-500">
                                            <h4 className="font-bold text-gray-800">{list.title}</h4>
                                            <p className="text-sm text-gray-600">{incomplete} مهمة متبقية</p>
                                        </div>
                                    );
                                })}
                                <button
                                    onClick={() => setActiveTab('todos')}
                                    className="w-full text-green-600 hover:text-green-700 text-sm font-semibold mt-2"
                                >
                                    عرض كل المهام ←
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Notes */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">آخر الملاحظات</h3>
                        <Mic className="text-yellow-500" size={24} />
                    </div>
                    {recentNotes.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">لا توجد ملاحظات بعد</p>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-4">
                            {recentNotes.map(note => (
                                <div key={note.id} className="bg-yellow-50 p-4 rounded-lg border-r-4 border-yellow-500">
                                    <h4 className="font-bold text-gray-800 mb-2">{note.title}</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // مكون التقويم والمواعيد
    const CalendarComponent = () => {
        const [showForm, setShowForm] = useState(false);
        const [editingId, setEditingId] = useState(null);
        const [formData, setFormData] = useState({
            title: '',
            date: '',
            time: '',
            type: 'appointment',
            reminder: true,
            notes: ''
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            const newEvent = {
                id: editingId || Date.now(),
                ...formData,
                createdAt: new Date().toISOString()
            };

            let updatedCalendar;
            if (editingId) {
                updatedCalendar = calendar.map(ev => ev.id === editingId ? newEvent : ev);
            } else {
                updatedCalendar = [...calendar, newEvent];
            }

            setCalendar(updatedCalendar);
            saveCalendar(updatedCalendar);
            setShowForm(false);
            setEditingId(null);
            setFormData({ title: '', date: '', time: '', type: 'appointment', reminder: true, notes: '' });
        };

        const handleEdit = (event) => {
            setFormData(event);
            setEditingId(event.id);
            setShowForm(true);
        };

        const handleDelete = (id) => {
            // eslint-disable-next-line no-restricted-globals
            if (confirm('هل أنت متأكد من حذف هذا الموعد؟')) {
                const updatedCalendar = calendar.filter(ev => ev.id !== id);
                setCalendar(updatedCalendar);
                saveCalendar(updatedCalendar);
            }
        };

        const filteredEvents = calendar
            .filter(ev => {
                const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (ev.notes && ev.notes.toLowerCase().includes(searchQuery.toLowerCase()));
                const matchesFilter = filterType === 'all' || ev.type === filterType;
                return matchesSearch && matchesFilter;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const upcomingEvents = filteredEvents.filter(ev => new Date(ev.date) >= new Date());
        const pastEvents = filteredEvents.filter(ev => new Date(ev.date) < new Date());

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">التقويم والمواعيد</h2>
                    <div className="flex gap-2">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="all">كل الأنواع</option>
                            <option value="appointment">مواعيد</option>
                            <option value="bill">فواتير</option>
                            <option value="reminder">تذكيرات</option>
                        </select>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            إضافة موعد
                        </button>
                    </div>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <input
                            type="text"
                            placeholder="عنوان الموعد *"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full p-3 border rounded-lg text-right"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                                className="p-3 border rounded-lg"
                            />
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="p-3 border rounded-lg"
                            />
                        </div>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full p-3 border rounded-lg text-right"
                        >
                            <option value="appointment">موعد</option>
                            <option value="bill">فاتورة</option>
                            <option value="reminder">تذكير</option>
                        </select>
                        <textarea
                            placeholder="ملاحظات إضافية"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full p-3 border rounded-lg text-right"
                            rows="3"
                        />
                        <label className="flex items-center gap-2 text-right">
                            <input
                                type="checkbox"
                                checked={formData.reminder}
                                onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })}
                            />
                            <span>تفعيل التذكير</span>
                        </label>
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600">
                                <Save className="inline ml-2" size={20} />
                                {editingId ? 'تحديث' : 'حفظ'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setFormData({ title: '', date: '', time: '', type: 'appointment', reminder: true, notes: '' });
                                }}
                                className="flex-1 bg-gray-400 text-white p-3 rounded-lg hover:bg-gray-500"
                            >
                                <X className="inline ml-2" size={20} />
                                إلغاء
                            </button>
                        </div>
                    </form>
                )}

                {upcomingEvents.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">المواعيد القادمة</h3>
                        <div className="space-y-3">
                            {upcomingEvents.map(event => (
                                <div key={event.id} className="border-r-4 border-blue-500 bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 text-right">
                                            <h4 className="font-bold text-lg">{event.title}</h4>
                                            <p className="text-gray-600">
                                                {new Date(event.date).toLocaleDateString('ar-EG')} {event.time && `- ${event.time}`}
                                            </p>
                                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${event.type === 'bill' ? 'bg-red-100 text-red-700' :
                                                    event.type === 'reminder' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {event.type === 'bill' ? 'فاتورة' : event.type === 'reminder' ? 'تذكير' : 'موعد'}
                                            </span>
                                            {event.notes && <p className="text-gray-500 mt-2 text-sm">{event.notes}</p>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(event)} className="text-blue-500 hover:text-blue-700">
                                                <Edit2 size={20} />
                                            </button>
                                            <button onClick={() => handleDelete(event.id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {pastEvents.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">المواعيد السابقة</h3>
                        <div className="space-y-3 opacity-60">
                            {pastEvents.slice(0, 5).map(event => (
                                <div key={event.id} className="border-r-4 border-gray-400 bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 text-right">
                                            <h4 className="font-bold">{event.title}</h4>
                                            <p className="text-sm text-gray-600">
                                                {new Date(event.date).toLocaleDateString('ar-EG')}
                                            </p>
                                        </div>
                                        <button onClick={() => handleDelete(event.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {filteredEvents.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد مواعيد بعد. ابدأ بإضافة موعدك الأول!'}
                    </div>
                )}
            </div>
        );
    };

    // مكون قوائم المهام
    const TodosComponent = () => {
        const [showForm, setShowForm] = useState(false);
        const [editingId, setEditingId] = useState(null);
        const [formData, setFormData] = useState({
            title: '',
            items: [],
            type: 'daily',
            shared: false
        });
        const [newItem, setNewItem] = useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            if (formData.items.length === 0) {
                alert('الرجاء إضافة عنصر واحد على الأقل');
                return;
            }

            const newList = {
                id: editingId || Date.now(),
                ...formData,
                createdAt: new Date().toISOString()
            };

            let updatedTodos;
            if (editingId) {
                updatedTodos = todos.map(td => td.id === editingId ? newList : td);
            } else {
                updatedTodos = [...todos, newList];
            }

            setTodos(updatedTodos);
            saveTodos(updatedTodos);
            setShowForm(false);
            setEditingId(null);
            setFormData({ title: '', items: [], type: 'daily', shared: false });
        };

        const addItem = () => {
            if (newItem.trim()) {
                setFormData({
                    ...formData,
                    items: [...formData.items, { id: Date.now(), text: newItem, completed: false }]
                });
                setNewItem('');
            }
        };

        const removeItem = (itemId) => {
            setFormData({
                ...formData,
                items: formData.items.filter(item => item.id !== itemId)
            });
        };

        const toggleItem = (listId, itemId) => {
            const updatedTodos = todos.map(list => {
                if (list.id === listId) {
                    return {
                        ...list,
                        items: list.items.map(item =>
                            item.id === itemId ? { ...item, completed: !item.completed } : item
                        )
                    };
                }
                return list;
            });
            setTodos(updatedTodos);
            saveTodos(updatedTodos);
        };

        const handleDelete = (id) => {
            // eslint-disable-next-line no-restricted-globals
            if (confirm('هل أنت متأكد من حذف هذه القائمة؟')) {
                const updatedTodos = todos.filter(td => td.id !== id);
                setTodos(updatedTodos);
                saveTodos(updatedTodos);
            }
        };

        const handleEdit = (list) => {
            setFormData(list);
            setEditingId(list.id);
            setShowForm(true);
        };

        const filteredTodos = todos.filter(list => {
            const matchesSearch = list.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterType === 'all' || list.type === filterType;
            return matchesSearch && matchesFilter;
        });

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">قوائم المهام والمشتريات</h2>
                    <div className="flex gap-2">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="all">كل القوائم</option>
                            <option value="daily">يومية</option>
                            <option value="weekly">أسبوعية</option>
                            <option value="shopping">مشتريات</option>
                            <option value="other">أخرى</option>
                        </select>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            قائمة جديدة
                        </button>
                    </div>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <input
                            type="text"
                            placeholder="اسم القائمة *"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full p-3 border rounded-lg text-right"
                        />
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full p-3 border rounded-lg text-right"
                        >
                            <option value="daily">يومية</option>
                            <option value="weekly">أسبوعية</option>
                            <option value="shopping">مشتريات</option>
                            <option value="other">أخرى</option>
                        </select>
                        <div className="space-y-2">
                            <label className="font-bold text-gray-700">العناصر:</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                                    placeholder="أضف عنصر..."
                                    className="flex-1 p-2 border rounded-lg text-right"
                                />
                                <button type="button" onClick={addItem} className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600">
                                    إضافة
                                </button>
                            </div>
                            {formData.items.length > 0 && (
                                <div className="space-y-2 mt-3 max-h-60 overflow-y-auto">
                                    {formData.items.map(item => (
                                        <div key={item.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                            <button type="button" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={16} />
                                            </button>
                                            <span className="flex-1 text-right mr-3">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <label className="flex items-center gap-2 text-right">
                            <input
                                type="checkbox"
                                checked={formData.shared}
                                onChange={(e) => setFormData({ ...formData, shared: e.target.checked })}
                            />
                            <span>مشاركة مع العائلة/الأصدقاء</span>
                        </label>
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600">
                                <Save className="inline ml-2" size={20} />
                                {editingId ? 'تحديث' : 'حفظ'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setFormData({ title: '', items: [], type: 'daily', shared: false });
                                    setNewItem('');
                                }}
                                className="flex-1 bg-gray-400 text-white p-3 rounded-lg hover:bg-gray-500"
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTodos.map(list => {
                        const completedCount = list.items.filter(i => i.completed).length;
                        const totalCount = list.items.length;
                        const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                        return (
                            <div key={list.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-right flex-1">
                                        <h3 className="text-xl font-bold text-gray-800">{list.title}</h3>
                                        <span className="text-sm text-gray-500">
                                            {list.type === 'daily' ? 'يومية' : list.type === 'weekly' ? 'أسبوعية' : list.type === 'shopping' ? 'مشتريات' : 'أخرى'}
                                        </span>
                                        {list.shared && <Share2 className="inline mr-2 text-blue-500" size={16} />}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(list)} className="text-blue-500 hover:text-blue-700">
                                            <Edit2 size={20} />
                                        </button>
                                        <button onClick={() => handleDelete(list.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>{completedCount} / {totalCount}</span>
                                        <span>{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {list.items.map(item => (
                                        <label key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={item.completed}
                                                onChange={() => toggleItem(list.id, item.id)}
                                                className="w-5 h-5"
                                            />
                                            <span className={`flex-1 text-right ${item.completed ? 'line-through text-gray-400' : ''}`}>
                                                {item.text}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredTodos.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد قوائم بعد. ابدأ بإنشاء قائمة جديدة!'}
                    </div>
                )}
            </div>
        );
    };

    // مكون المستندات
    const DocumentsComponent = () => {
        const [showForm, setShowForm] = useState(false);
        const [formData, setFormData] = useState({
            title: '',
            type: 'contract',
            description: '',
            fileData: null,
            fileName: '',
            fileType: ''
        });

        const handleFileUpload = (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    alert('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    setFormData({
                        ...formData,
                        fileData: event.target.result,
                        fileName: file.name,
                        fileType: file.type
                    });
                };
                reader.readAsDataURL(file);
            }
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            const newDoc = {
                id: Date.now(),
                ...formData,
                createdAt: new Date().toISOString()
            };

            const updatedDocs = [...documents, newDoc];
            setDocuments(updatedDocs);
            saveDocuments(updatedDocs);
            setShowForm(false);
            setFormData({ title: '', type: 'contract', description: '', fileData: null, fileName: '', fileType: '' });
        };

        const handleDelete = (id) => {
            // eslint-disable-next-line no-restricted-globals
            if (confirm('هل أنت متأكد من حذف هذا المستند؟')) {
                const updatedDocs = documents.filter(doc => doc.id !== id);
                setDocuments(updatedDocs);
                saveDocuments(updatedDocs);
            }
        };

        const filteredDocs = documents.filter(doc => {
            const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesFilter = filterType === 'all' || doc.type === filterType;
            return matchesSearch && matchesFilter;
        });

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">المستندات والملفات</h2>
                    <div className="flex gap-2">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="all">كل الأنواع</option>
                            <option value="contract">عقود</option>
                            <option value="warranty">ضمانات</option>
                            <option value="certificate">شهادات</option>
                            <option value="photo">صور</option>
                            <option value="other">أخرى</option>
                        </select>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center gap-2"
                        >
                            <Upload size={20} />
                            رفع مستند
                        </button>
                    </div>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <input
                            type="text"
                            placeholder="اسم المستند *"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full p-3 border rounded-lg text-right"
                        />
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full p-3 border rounded-lg text-right"
                        >
                            <option value="contract">عقد</option>
                            <option value="warranty">ضمان</option>
                            <option value="certificate">شهادة</option>
                            <option value="photo">صورة</option>
                            <option value="other">أخرى</option>
                        </select>
                        <textarea
                            placeholder="وصف المستند"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-3 border rounded-lg text-right"
                            rows="3"
                        />
                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                accept="image/*,.pdf,.doc,.docx"
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload className="mx-auto mb-2 text-gray-400" size={40} />
                                <p className="text-gray-600">اضغط لاختيار ملف (حد أقصى 5 ميجا)</p>
                                <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, صور</p>
                                {formData.fileName && (
                                    <p className="text-green-600 mt-2 font-semibold">✓ {formData.fileName}</p>
                                )}
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600">
                                <Save className="inline ml-2" size={20} />
                                حفظ
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setFormData({ title: '', type: 'contract', description: '', fileData: null, fileName: '', fileType: '' });
                                }}
                                className="flex-1 bg-gray-400 text-white p-3 rounded-lg hover:bg-gray-500"
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDocs.map(doc => (
                        <div key={doc.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            {doc.fileData && doc.fileType.startsWith('image/') && (
                                <img
                                    src={doc.fileData}
                                    alt={doc.title}
                                    className="w-full h-40 object-cover rounded-lg mb-3"
                                />
                            )}
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-gray-800 text-right flex-1">{doc.title}</h3>
                                <button onClick={() => handleDelete(doc.id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm mb-2">
                                {doc.type === 'contract' ? 'عقد' : doc.type === 'warranty' ? 'ضمان' : doc.type === 'certificate' ? 'شهادة' : doc.type === 'photo' ? 'صورة' : 'أخرى'}
                            </span>
                            {doc.description && <p className="text-gray-600 text-sm text-right mb-3">{doc.description}</p>}
                            {doc.fileData && (
                                <a
                                    href={doc.fileData}
                                    download={doc.fileName}
                                    className="flex items-center justify-center gap-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                                >
                                    <Download size={16} />
                                    تحميل الملف
                                </a>
                            )}
                            <p className="text-xs text-gray-400 text-right mt-2">
                                {new Date(doc.createdAt).toLocaleDateString('ar-EG')}
                            </p>
                        </div>
                    ))}
                </div>

                {filteredDocs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد مستندات محفوظة. ابدأ برفع مستنداتك المهمة!'}
                    </div>
                )}
            </div>
        );
    };

    // مكون الملاحظات
    const NotesComponent = () => {
        const [showForm, setShowForm] = useState(false);
        const [editingId, setEditingId] = useState(null);
        const [formData, setFormData] = useState({
            title: '',
            content: '',
            type: 'text',
            color: 'yellow'
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            const newNote = {
                id: editingId || Date.now(),
                ...formData,
                createdAt: editingId ? notes.find(n => n.id === editingId)?.createdAt : new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            let updatedNotes;
            if (editingId) {
                updatedNotes = notes.map(n => n.id === editingId ? newNote : n);
            } else {
                updatedNotes = [...notes, newNote];
            }

            setNotes(updatedNotes);
            saveNotes(updatedNotes);
            setShowForm(false);
            setEditingId(null);
            setFormData({ title: '', content: '', type: 'text', color: 'yellow' });
        };

        const handleEdit = (note) => {
            setFormData(note);
            setEditingId(note.id);
            setShowForm(true);
        };

        const handleDelete = (id) => {
            // eslint-disable-next-line no-restricted-globals
            if (confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
                const updatedNotes = notes.filter(n => n.id !== id);
                setNotes(updatedNotes);
                saveNotes(updatedNotes);
            }
        };

        const filteredNotes = notes.filter(note => {
            const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterType === 'all' || note.type === filterType;
            return matchesSearch && matchesFilter;
        });

        const colors = {
            yellow: 'bg-yellow-100 border-yellow-300',
            blue: 'bg-blue-100 border-blue-300',
            green: 'bg-green-100 border-green-300',
            pink: 'bg-pink-100 border-pink-300',
            purple: 'bg-purple-100 border-purple-300'
        };

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">الملاحظات</h2>
                    <div className="flex gap-2">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="all">كل الأنواع</option>
                            <option value="text">نصية</option>
                            <option value="voice">صوتية</option>
                        </select>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            ملاحظة جديدة
                        </button>
                    </div>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <input
                            type="text"
                            placeholder="عنوان الملاحظة *"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full p-3 border rounded-lg text-right"
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'text' })}
                                className={`flex-1 p-2 rounded ${formData.type === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                <FileText className="inline ml-2" size={16} />
                                نصية
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'voice' })}
                                className={`flex-1 p-2 rounded ${formData.type === 'voice' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                            >
                                <Mic className="inline ml-2" size={16} />
                                صوتية
                            </button>
                        </div>
                        <textarea
                            placeholder="محتوى الملاحظة..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            className="w-full p-3 border rounded-lg text-right"
                            rows="6"
                        />
                        <div>
                            <label className="block text-right mb-2 font-semibold">اللون:</label>
                            <div className="flex gap-2">
                                {Object.entries(colors).map(([colorName, colorClass]) => (
                                    <button
                                        key={colorName}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color: colorName })}
                                        className={`w-10 h-10 rounded-full border-4 ${colorClass} ${formData.color === colorName ? 'ring-4 ring-gray-400' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600">
                                <Save className="inline ml-2" size={20} />
                                {editingId ? 'تحديث' : 'حفظ'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setFormData({ title: '', content: '', type: 'text', color: 'yellow' });
                                }}
                                className="flex-1 bg-gray-400 text-white p-3 rounded-lg hover:bg-gray-500"
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredNotes.map(note => (
                        <div
                            key={note.id}
                            className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-r-4 ${colors[note.color] || colors.yellow}`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-gray-800 text-right flex-1">{note.title}</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(note)} className="text-blue-500 hover:text-blue-700">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(note.id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm mb-2 ${note.type === 'voice' ? 'bg-red-200 text-red-700' : 'bg-blue-200 text-blue-700'
                                }`}>
                                {note.type === 'voice' ? <Mic size={14} /> : <FileText size={14} />}
                                {note.type === 'voice' ? 'صوتية' : 'نصية'}
                            </span>
                            <p className="text-gray-700 text-right text-sm whitespace-pre-wrap">{note.content}</p>
                            <p className="text-xs text-gray-400 text-right mt-3">
                                {new Date(note.updatedAt || note.createdAt).toLocaleDateString('ar-EG')}
                            </p>
                        </div>
                    ))}
                </div>

                {filteredNotes.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد ملاحظات. ابدأ بتسجيل أفكارك وملاحظاتك!'}
                    </div>
                )}
            </div>
        );
    };

    // الواجهة الرئيسية
    const tabs = [
        { id: 'home', label: 'الرئيسية', icon: Home, color: 'gray' },
        { id: 'calendar', label: 'التقويم', icon: Calendar, color: 'blue' },
        { id: 'todos', label: 'المهام', icon: CheckSquare, color: 'green' },
        { id: 'documents', label: 'المستندات', icon: FileText, color: 'purple' },
        { id: 'notes', label: 'الملاحظات', icon: Mic, color: 'yellow' }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50" dir="rtl">
            {/* Header */}
            <div className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            مساعدك الشخصي 🎯
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Bell className="text-orange-500 cursor-pointer hover:scale-110 transition-transform" size={28} />
                                {calendar.filter(ev => new Date(ev.date) >= new Date()).length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {calendar.filter(ev => new Date(ev.date) >= new Date()).length}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Search - Only show when not on home page */}
                    {activeTab !== 'home' && (
                        <div className="relative">
                            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="ابحث..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pr-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto border-t hide-scrollbar">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setSearchQuery('');
                                    setFilterType('all');
                                }}
                                className={`flex items-center gap-2 px-6 py-3 whitespace-nowrap transition-all ${activeTab === tab.id
                                        ? `border-b-4 border-${tab.color}-500 text-${tab.color}-600 bg-${tab.color}-50`
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-semibold">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {activeTab === 'home' && <HomeComponent />}
                {activeTab === 'calendar' && <CalendarComponent />}
                {activeTab === 'todos' && <TodosComponent />}
                {activeTab === 'documents' && <DocumentsComponent />}
                {activeTab === 'notes' && <NotesComponent />}
            </div>

            {/* Footer */}
            <div className="bg-white border-t mt-8 py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-3xl font-bold text-blue-600">{calendar.length}</p>
                            <p className="text-sm text-gray-600">موعد محفوظ</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-3xl font-bold text-green-600">{todos.length}</p>
                            <p className="text-sm text-gray-600">قائمة مهام</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-3xl font-bold text-purple-600">{documents.length}</p>
                            <p className="text-sm text-gray-600">مستند</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                            <p className="text-3xl font-bold text-yellow-600">{notes.length}</p>
                            <p className="text-sm text-gray-600">ملاحظة</p>
                        </div>
                    </div>
                    <p className="text-center text-gray-500 text-sm mt-6">
                        جميع بياناتك محفوظة بشكل آمن ومتاحة في أي وقت 🔒
                    </p>
                </div>
            </div>

            <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
}