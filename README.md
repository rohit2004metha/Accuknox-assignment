# Dynamic Dashboard - Accuknox Frontend Assignment

A modern, responsive dashboard application built with vanilla HTML, CSS, and JavaScript that allows users to dynamically add, remove, and manage widgets across different categories.

## 🚀 Features

### Core Functionality
- **Dynamic Widget Management**: Add, remove, and organize widgets across categories
- **Category-based Organization**: Organize widgets into logical categories (CNAPP, CWPP, Registry Scan)
- **Real-time Search**: Global search functionality to find widgets across all categories
- **Local Storage**: Persistent data storage using browser's localStorage
- **Responsive Design**: Mobile-first design that works on all device sizes

### Widget Types
- **Donut Charts**: Circular charts with data segments and legends
- **Progress Bars**: Horizontal progress indicators with color-coded segments
- **Bar Charts**: Placeholder for graph visualizations
- **Text Widgets**: Simple text display widgets
- **Metric Cards**: Key metrics display cards

### User Interface
- **Modern Design**: Clean, professional interface matching the provided design
- **Interactive Modals**: User-friendly forms for adding and managing widgets
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Visual feedback during operations
- **Hover Effects**: Interactive elements with smooth transitions

## 📁 Project Structure

```
├── dashboard.html              # Main dashboard HTML file
├── dashboard-styles.css        # CSS styles and responsive design
├── dashboard-script.js         # JavaScript functionality and state management
├── dashboard-data.json         # Initial data structure for categories and widgets
└── README.md                   # Project documentation
```

## 🎨 Design Features

### Visual Elements
- **Top Navigation Bar**: Breadcrumb navigation, search bar, and control buttons
- **Category Headers**: Clear section titles with management controls
- **Widget Cards**: Clean card-based layout with hover effects
- **Modal Dialogs**: Professional forms for widget management
- **Color-coded Data**: Visual indicators for different data types

### Responsive Breakpoints
- **Desktop**: > 1024px - Full grid layout with all features
- **Tablet**: 768px - 1024px - Adjusted grid and navigation
- **Mobile**: < 768px - Single column layout with stacked navigation

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and accessibility
- **CSS3**: 
  - CSS Grid and Flexbox for layouts
  - CSS Custom Properties (variables)
  - Animations and transitions
  - Media queries for responsiveness
- **JavaScript (ES6+)**:
  - ES6 Classes and modules
  - Fetch API for data loading
  - Local Storage API
  - DOM manipulation and event handling
  - Async/await for asynchronous operations

## 📋 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional but recommended)

### Installation & Setup

1. **Download/Clone the Project**
   ```bash
   # If using git
   git clone <repository-url>
   cd dashboard-project
   
   # Or simply download and extract the ZIP file
   ```

2. **Serve the Files**
   
   **Option A: Using Python (Recommended)**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option B: Using Node.js**
   ```bash
   # Install serve globally
   npm install -g serve
   
   # Serve the files
   serve .
   ```
   
   **Option C: Using PHP**
   ```bash
   php -S localhost:8000
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:8000/dashboard.html`
   - The dashboard should load with the initial data

### Alternative: Direct File Access
If you don't want to use a local server, you can open `dashboard.html` directly in your browser, but some features (like loading the JSON data) may not work due to CORS restrictions.

## 🎯 How to Use

### Adding Widgets
1. Click the **"Add Widget"** button in the top navigation or within any category
2. Fill in the widget details:
   - **Widget Name**: Display name for the widget
   - **Widget Type**: Choose from available types (Donut Chart, Progress Bar, etc.)
   - **Widget Content**: Main text/content to display
   - **Category**: Select which category to add the widget to
   - **Description**: Optional description text
3. Click **"Add Widget"** to save

### Managing Widgets
1. Click the **"Manage"** button in any category header
2. Use the search box to filter widgets
3. Click **"Remove"** to delete widgets
4. Close the modal when done

### Searching Widgets
- Use the global search bar in the top navigation
- Search by widget name, content, or description
- Results are filtered in real-time

### Removing Widgets
- **Method 1**: Hover over a widget and click the "×" button
- **Method 2**: Use the "Manage" button in category headers
- **Method 3**: Use the widget management modal

## 🔧 Configuration

### Modifying Initial Data
Edit `dashboard-data.json` to change:
- Category names and structure
- Initial widgets and their data
- Available widget types
- Default data values

### Customizing Widget Types
Add new widget types by:
1. Adding the type to `availableWidgetTypes` in the JSON
2. Implementing the rendering logic in `createWidgetElement()` method
3. Adding CSS styles for the new widget type

### Styling Customization
- Modify `dashboard-styles.css` for visual changes
- Update CSS custom properties for color schemes
- Adjust responsive breakpoints as needed

## 📱 Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## 🚀 Performance Features

- **Lazy Loading**: Widgets are rendered only when needed
- **Efficient DOM Updates**: Minimal DOM manipulation for better performance
- **Debounced Search**: Optimized search with reduced API calls
- **Local Storage**: Fast data persistence without server calls
- **Responsive Images**: Optimized for different screen sizes

## 🔒 Data Persistence

The application uses browser's localStorage to persist:
- Added widgets and their configurations
- Category modifications
- User preferences

Data is automatically saved when:
- Adding new widgets
- Removing widgets
- Modifying widget properties

## 🎨 Customization Options

### Adding New Widget Types
1. Update `dashboard-data.json` with new widget type
2. Add rendering logic in `dashboard-script.js`
3. Create CSS styles for the new widget type

### Modifying Categories
- Edit the `categories` array in `dashboard-data.json`
- Categories are automatically rendered based on the JSON structure

### Styling Changes
- Modify CSS custom properties for consistent theming
- Update color schemes in the CSS file
- Adjust spacing and typography as needed

## 🐛 Troubleshooting

### Common Issues

**Dashboard doesn't load**
- Ensure you're serving files through a local server
- Check browser console for JavaScript errors
- Verify `dashboard-data.json` is accessible

**Widgets not saving**
- Check if localStorage is enabled in your browser
- Clear browser cache and try again
- Verify JavaScript is enabled

**Search not working**
- Ensure the search input is focused
- Check for JavaScript errors in console
- Try refreshing the page

**Styling issues**
- Clear browser cache
- Check CSS file is loading correctly
- Verify responsive breakpoints

## 🔮 Future Enhancements

- [ ] Drag and drop widget reordering
- [ ] Widget templates and presets
- [ ] Export/import dashboard configurations
- [ ] Real-time data updates
- [ ] Advanced chart types (line charts, scatter plots)
- [ ] Widget collaboration features
- [ ] Dark mode theme
- [ ] Widget analytics and usage tracking

## 📄 Assignment Requirements Fulfilled

✅ **JSON Structure**: Dynamic dashboard built from JSON configuration  
✅ **Category Management**: Multiple categories with widget organization  
✅ **Dynamic Widget Addition**: Add widgets with custom names and content  
✅ **Widget Removal**: Multiple methods to remove widgets (cross icon, management modal)  
✅ **Search Functionality**: Global search across all widgets  
✅ **Local Storage**: Persistent data management  
✅ **Modern Technology**: Built with HTML5, CSS3, and ES6+ JavaScript  
✅ **Responsive Design**: Mobile-first approach with all device support  

## 👨‍💻 Development Notes

### Code Organization
- **Modular JavaScript**: Class-based architecture for maintainability
- **Separation of Concerns**: HTML, CSS, and JavaScript are properly separated
- **Event-driven Architecture**: Clean event handling and delegation
- **Error Handling**: Comprehensive error handling and user feedback

### Best Practices
- **Accessibility**: Semantic HTML and ARIA attributes
- **Performance**: Optimized rendering and minimal DOM manipulation
- **Security**: Input validation and XSS prevention
- **Maintainability**: Clean, documented code with consistent naming

## 📞 Support

For questions or issues with this assignment:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure all files are properly served through a local server
4. Verify browser compatibility

---

**Built with ❤️ for Accuknox Frontend Trainee Assignment**

*Demonstrating modern web development skills with vanilla JavaScript, responsive design, and dynamic content management.*
