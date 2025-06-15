        const state = {
            selectedComponents: {
                body: {
                    id: 1,
                    path: './assets/body/body-1.png'
                },
                mouth: null,
                eyes: null,
                head: null,
                accessory: null
            },
            positions: {
                body: { x: -1, y: 0 },
                mouth: { x: 0, y: 4 },
                eyes: { x: 0, y: -4 },
                head: { x: 0, y: -16 },
                accessory: { x: 0, y: 16 }
            },
            transforms: {
                body: { rotate: 0, scale: 1, invert: false },
                mouth: { rotate: 0, scale: 1, invert: false },
                eyes: { rotate: 0, scale: 1, invert: false },
                head: { rotate: 0, scale: 1, invert: false },
                accessory: { rotate: 0, scale: 1, invert: false }
            },
            selectedForMoving: null,
            backgroundColor: '#ffffff',
            savedCharacters: []
        };

        // Component counts
        const componentCounts = {
            body: 21,
            mouth: 29,
            eyes: 24,
            head: 15,
            accessory: 22
        };

        // Notification System
        function showNotification(message, type = 'info', duration = 3000) {
            const container = document.getElementById('notificationContainer');
            const notification = document.createElement('div');
            
            // Base classes for all notifications
            let classes = 'p-4 rounded-lg border-2 shadow-lg transition-all duration-300 transform translate-x-full opacity-0 flex items-center gap-3 min-w-0';
            
            // Type-specific styling
            switch(type) {
                case 'success':
                    classes += ' bg-green-50 border-green-200 text-green-800';
                    break;
                case 'error':
                    classes += ' bg-red-50 border-red-200 text-red-800';
                    break;
                case 'warning':
                    classes += ' bg-yellow-50 border-yellow-200 text-yellow-800';
                    break;
                default: // info
                    classes += ' bg-blue-50 border-blue-200 text-blue-800';
            }
            
            notification.className = classes;
            
            // Add icon based on type
            let icon = '';
            switch(type) {
                case 'success': icon = '<i class="ph ph-check-circle text-green-600 flex-shrink-0"></i>'; break;
                case 'error': icon = '<i class="ph ph-x-circle text-red-600 flex-shrink-0"></i>'; break;
                case 'warning': icon = '<i class="ph ph-warning-circle text-yellow-600 flex-shrink-0"></i>'; break;
                default: icon = '<i class="ph ph-info text-blue-600 flex-shrink-0"></i>';
            }
            
            notification.innerHTML = `
                ${icon}
                <span class="flex-1 text-sm font-medium">${message}</span>
                <button onclick="this.parentElement.remove()" class="flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-10 rounded">
                    <i class="ph ph-x text-xs"></i>
                </button>
            `;
            
            container.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.classList.remove('translate-x-full', 'opacity-0');
            }, 10);
            
            // Auto-remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.classList.add('translate-x-full', 'opacity-0');
                        setTimeout(() => {
                            if (notification.parentElement) {
                                notification.remove();
                            }
                        }, 300);
                    }
                }, duration);
            }
        }

        // Modal System
        function showModal(title, content, actions = []) {
            const overlay = document.getElementById('modalOverlay');
            const modalContent = document.getElementById('modalContent');
            
            let actionsHtml = '';
            if (actions.length > 0) {
                actionsHtml = '<div class="flex gap-2 mt-6 justify-end">';
                actions.forEach(action => {
                    const buttonClass = action.primary 
                        ? 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium'
                        : 'px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium';
                    actionsHtml += `<button class="${buttonClass}" onclick="${action.action}">${action.text}</button>`;
                });
                actionsHtml += '</div>';
            }
            
            modalContent.innerHTML = `
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-gray-800">${title}</h2>
                    <button onclick="hideModal()" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                        <i class="ph ph-x"></i>
                    </button>
                </div>
                <div class="text-gray-600 mb-4">${content}</div>
                ${actionsHtml}
            `;
            
            overlay.classList.remove('hidden');
        }

        function hideModal() {
            const overlay = document.getElementById('modalOverlay');
            overlay.classList.add('hidden');
        }

        // Confirmation Modal
        function showConfirmation(title, message, onConfirm, onCancel = null) {
            const actions = [
                {
                    text: 'Cancel',
                    action: onCancel ? `(${onCancel})(); hideModal();` : 'hideModal()',
                    primary: false
                },
                {
                    text: 'Confirm',
                    action: `(${onConfirm})(); hideModal();`,
                    primary: true
                }
            ];
            
            showModal(title, message, actions);
        }

        // Generate component thumbnail
        function createThumbnail(category, id, isSelected = false) {
            const button = document.createElement('button');
            const isBeingMoved = state.selectedForMoving === category && state.selectedComponents[category]?.id === id;
            
            let borderClass = 'border-gray-300';
            if (isBeingMoved) {
                borderClass = 'border-blue-500';
            } else if (isSelected) {
                borderClass = 'border-green-500';
            }
            
            // Use unique class for mouth thumbnails
            const thumbnailClass = category === 'mouth' ? 'mouth-thumbnail' : 'component-thumbnail';
            button.className = `${thumbnailClass} flex-shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden transition-all bg-white hover:border-gray-400 ${borderClass}`;

            if (id === 0) {
                button.innerHTML = '<span class="text-gray-400 text-lg flex items-center justify-center h-full">∅</span>';
            } else {
                const img = document.createElement('img');
                const thumbnailPath = category === 'body' 
                    ? `./assets/icon/icon-${id}.png`
                    : `./assets/${category}/${category}-${id}.png`;
                
                img.src = thumbnailPath;
                img.alt = `${category}-${id}`;
                img.className = 'w-full h-full object-contain';
                img.onerror = function() {
                    this.style.display = 'none';
                    button.innerHTML = `<div class="flex items-center justify-center h-full text-xs text-gray-400">${category}-${id}</div>`;
                };
                button.appendChild(img);
            }

            button.onclick = function() {
                selectComponent(category, id);
                // Show movement overlay when selecting a component (except body and none)
                if (category !== 'body' && id !== 0) {
                    showMovementOverlay(category);
                }
            };
            return button;
        }

        // Populate component selectors
        function populateSelectors() {
            ['head', 'eyes', 'mouth', 'accessory'].forEach(category => {
                const container = document.getElementById(category + 'Selector');
                if (container) {
                    container.innerHTML = '';
                    
                    // Add "none" option
                    const noneSelected = !state.selectedComponents[category];
                    container.appendChild(createThumbnail(category, 0, noneSelected));
                    
                    // Add numbered options
                    for (let i = 1; i <= componentCounts[category]; i++) {
                        const isSelected = state.selectedComponents[category]?.id === i;
                        container.appendChild(createThumbnail(category, i, isSelected));
                    }
                }
            });

            // Populate body selector
            const bodyGrid = document.getElementById('bodyGrid');
            if (bodyGrid) {
                bodyGrid.innerHTML = '';
                for (let i = 1; i <= componentCounts.body; i++) {
                    const isSelected = state.selectedComponents.body?.id === i;
                    bodyGrid.appendChild(createThumbnail('body', i, isSelected));
                }
            }
        }

        // Select component
        function selectComponent(category, id) {
            if (id === 0) {
                state.selectedComponents[category] = null;
            } else {
                state.selectedComponents[category] = {
                    id: id,
                    path: `./assets/${category}/${category}-${id}.png`
                };
                
                // Set default position for new components (if not already positioned)
                if (category !== 'body' && (state.positions[category].x === 0 && state.positions[category].y === 0)) {
                    switch(category) {
                        case 'head': state.positions[category] = { x: 0, y: -16 }; break;
                        case 'eyes': state.positions[category] = { x: 0, y: -4 }; break;
                        case 'mouth': state.positions[category] = { x: 0, y: 4 }; break;
                        case 'accessory': state.positions[category] = { x: 0, y: 16 }; break;
                    }
                }
            }

            updateDisplay();
            
            if (category === 'body') {
                const bodySelector = document.getElementById('bodySelector');
                if (bodySelector) {
                    bodySelector.classList.add('hidden');
                }
            }

            // Hide movement overlay if selecting same category
            if (state.selectedForMoving === category) {
                hideMovementOverlay();
            }

            // Update export button
            updateExportButton();

            // Refresh selectors to update selection state
            populateSelectors();
        }

        // Update export button state
        function updateExportButton() {
            const exportBtn = document.getElementById('exportBtn');
            if (exportBtn) {
                if (state.selectedComponents.body) {
                    exportBtn.disabled = false;
                    exportBtn.className = 'w-full mt-4 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white';
                    exportBtn.innerHTML = '<i class="ph ph-export"></i> Export';
                } else {
                    exportBtn.disabled = true;
                    exportBtn.className = 'w-full mt-4 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 bg-gray-200 text-gray-400 cursor-not-allowed';
                    exportBtn.innerHTML = '<i class="ph ph-export"></i> Export';
                }
            }
        }

        // Update character display
        function updateDisplay() {
            const placeholder = document.getElementById('placeholder');
            const hasBody = state.selectedComponents.body !== null;
            
            if (placeholder) {
                placeholder.style.display = hasBody ? 'none' : 'block';
            }

            // Update each layer
            ['body', 'mouth', 'eyes', 'head', 'accessory'].forEach(category => {
                const layer = document.getElementById(category + 'Layer');
                if (layer) {
                    const component = state.selectedComponents[category];
                    const position = state.positions[category];
                    const transforms = state.transforms[category];

                    if (component) {
                        layer.src = component.path;
                        layer.style.display = 'block';
                        
                        // Apply all transforms: translate, rotate, scale, invert
                        const invertFilter = transforms.invert ? 'invert(1)' : 'invert(0)';
                        const transformString = `translate(${position.x}px, ${position.y}px) rotate(${transforms.rotate}deg) scale(${transforms.scale})`;
                        layer.style.transform = transformString;
                        layer.style.filter = invertFilter;
                        layer.style.maxWidth = 'none';
                        layer.style.height = 'auto';
                        layer.style.width = 'auto';
                        layer.style.transformOrigin = 'center center';
                        
                        // Remove click handler for body, add for others
                        if (category !== 'body') {
                            layer.onclick = function() {
                                showMovementOverlay(category);
                            };
                        } else {
                            layer.onclick = null;
                        }
                    } else {
                        layer.style.display = 'none';
                    }
                }
            });
        }

        // Local storage functions
        function saveCharactersToStorage() {
            try {
                localStorage.setItem('characterCreatorSaves', JSON.stringify(state.savedCharacters));
            } catch (e) {
                console.warn('Could not save to localStorage:', e);
                showNotification('Could not save to storage', 'warning');
            }
        }

        function loadCharactersFromStorage() {
            try {
                const saved = localStorage.getItem('characterCreatorSaves');
                if (saved) {
                    state.savedCharacters = JSON.parse(saved);
                } else {
                    // Initialize with empty slots
                    state.savedCharacters = Array(8).fill(null);
                }
            } catch (e) {
                console.warn('Could not load from localStorage:', e);
                showNotification('Could not load saved characters', 'warning');
                state.savedCharacters = Array(8).fill(null);
            }
        }

        // Save current character to slot
        async function saveCharacter(slotIndex) {
            try {
                const characterData = {
                    selectedComponents: { ...state.selectedComponents },
                    positions: { ...state.positions },
                    transforms: { ...state.transforms },
                    backgroundColor: state.backgroundColor,
                    savedAt: new Date().toISOString(),
                    thumbnail: await generateThumbnail()
                };
                
                state.savedCharacters[slotIndex] = characterData;
                saveCharactersToStorage();
                updateSavedCharactersDisplay();
                showNotification(`Character saved to slot ${slotIndex + 1}!`, 'success');
            } catch (error) {
                console.error('Save failed:', error);
                showNotification('Failed to save character', 'error');
            }
        }

        // Load character from slot
        function loadCharacter(slotIndex) {
            const characterData = state.savedCharacters[slotIndex];
            if (!characterData) {
                showNotification('No character found in this slot', 'warning');
                return;
            }
            
            try {
                state.selectedComponents = { ...characterData.selectedComponents };
                state.positions = { ...characterData.positions };
                state.transforms = { ...characterData.transforms };
                
                // Load background color if saved
                if (characterData.backgroundColor) {
                    state.backgroundColor = characterData.backgroundColor;
                    document.getElementById('characterCanvas').style.backgroundColor = characterData.backgroundColor;
                    document.getElementById('backgroundColorInput').value = characterData.backgroundColor;
                }
                
                updateDisplay();
                updateExportButton();
                populateSelectors();
                showNotification(`Character loaded from slot ${slotIndex + 1}!`, 'success');
            } catch (error) {
                console.error('Load failed:', error);
                showNotification('Failed to load character', 'error');
            }
        }

        // Delete character from slot
        function deleteCharacter(slotIndex) {
            showConfirmation(
                'Delete Character',
                `Are you sure you want to delete the character in slot ${slotIndex + 1}? This action cannot be undone.`,
                () => {
                    state.savedCharacters[slotIndex] = null;
                    saveCharactersToStorage();
                    updateSavedCharactersDisplay();
                    showNotification(`Character deleted from slot ${slotIndex + 1}`, 'success');
                }
            );
        }

        // Generate thumbnail for saved character using actual character rendering
        async function generateThumbnail() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 64;
            canvas.height = 64;
            
            try {
                // Use actual background color
                ctx.fillStyle = state.backgroundColor;
                ctx.fillRect(0, 0, 64, 64);
                
                // Render each layer in order (same as PDF export)
                const layers = ['body', 'mouth', 'eyes', 'head', 'accessory'];
                
                for (const category of layers) {
                    const component = state.selectedComponents[category];
                    if (component && component.id !== 0) {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        
                        await new Promise((resolve, reject) => {
                            img.onload = () => {
                                // Get transforms
                                const position = state.positions[category];
                                const transforms = state.transforms[category];
                                
                                // Save context
                                ctx.save();
                                
                                // Apply transforms with invert filter
                                const centerX = 32; // Half of 64px
                                const centerY = 32;
                                
                                // Scale down the positioning for thumbnail (divide by 6 to fit in 64px)
                                const scaleFactor = 0.16; // Adjust this to fit character in thumbnail
                                
                                ctx.translate(centerX + (position.x * scaleFactor), centerY + (position.y * scaleFactor));
                                ctx.rotate((transforms.rotate * Math.PI) / 180);
                                ctx.scale(transforms.scale * scaleFactor, transforms.scale * scaleFactor);
                                
                                // Apply invert filter if needed
                                if (transforms.invert) {
                                    ctx.filter = 'invert(1)';
                                }
                                
                                // Draw image centered
                                ctx.drawImage(img, -img.width / 2, -img.height / 2);
                                
                                // Reset filter
                                ctx.filter = 'none';
                                
                                // Restore context
                                ctx.restore();
                                resolve();
                            };
                            img.onerror = () => resolve(); // Continue even if image fails to load
                            img.src = component.path;
                        });
                    }
                }
                
                return canvas.toDataURL();
                
            } catch (error) {
                console.warn('Thumbnail generation failed, using fallback:', error);
                // Fallback to simple colored thumbnail
                const bodyId = state.selectedComponents.body?.id || 1;
                const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
                ctx.fillStyle = colors[bodyId % colors.length];
                ctx.fillRect(0, 0, 64, 64);
                return canvas.toDataURL();
            }
        }

        // Update saved characters display
        function updateSavedCharactersDisplay() {
            const grid = document.getElementById('savedCharactersGrid');
            if (!grid) return;
            
            grid.innerHTML = '';
            
            for (let i = 0; i < 8; i++) {
                const characterData = state.savedCharacters[i];
                const slot = document.createElement('div');
                slot.className = 'relative w-16 h-16 border-2 border-gray-300 rounded-lg overflow-hidden bg-white cursor-pointer hover:border-gray-400 group';
                
                if (characterData) {
                    // Has saved character
                    slot.innerHTML = `
                        <img src="${characterData.thumbnail}" alt="Saved ${i+1}" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button onclick="loadCharacter(${i})" class="text-white text-xs mr-1" title="Load"><i class="ph ph-folder-open text-xs"></i></button>
                            <button onclick="saveCharacter(${i})" class="text-white text-xs mr-1" title="Save"><i class="ph ph-floppy-disk text-xs"></i></button>
                            <button onclick="deleteCharacter(${i})" class="text-white text-xs" title="Delete"><i class="ph ph-trash text-xs"></i></button>
                        </div>
                    `;
                } else {
                    // Empty slot
                    slot.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center text-gray-400">∅</div>
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button onclick="saveCharacter(${i})" class="text-white text-xs" title="Save"><i class="ph ph-floppy-disk text-xs"></i></button>
                        </div>
                    `;
                }
                
                grid.appendChild(slot);
            }
        }

        // Show save/load popup
        function showLoadPopup() {
            const popup = document.getElementById('loadCharacterPopup');
            const grid = document.getElementById('loadCharacterGrid');
            
            if (!popup || !grid) return;
            
            // Populate grid
            grid.innerHTML = '';
            for (let i = 0; i < 8; i++) {
                const characterData = state.savedCharacters[i];
                const slot = document.createElement('div');
                slot.className = 'w-16 h-16 border-2 border-gray-300 rounded-lg overflow-hidden bg-white cursor-pointer hover:border-blue-400';
                
                if (characterData) {
                    slot.innerHTML = `<img src="${characterData.thumbnail}" alt="Saved ${i+1}" class="w-full h-full object-cover">`;
                    slot.onclick = () => {
                        loadCharacter(i);
                        popup.classList.add('hidden');
                    };
                } else {
                    slot.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400">∅</div>';
                    slot.className += ' cursor-not-allowed opacity-50';
                }
                
                grid.appendChild(slot);
            }
            
            popup.classList.remove('hidden');
        }

        // Export to PDF function
        const exportToPDF = async () => {
            if (!state.selectedComponents.body) {
                showNotification('Please select a body component before exporting', 'warning');
                return;
            }
            
            try {
                showNotification('Generating PDF...', 'info', 0); // No auto-dismiss
                
                // Get the character canvas
                const canvas = document.getElementById('characterCanvas');
                const originalBg = canvas.style.backgroundColor;
                
                // Temporarily set white background for export
                canvas.style.backgroundColor = 'white';
                
                // Create a new canvas for the character only
                const exportCanvas = document.createElement('canvas');
                const ctx = exportCanvas.getContext('2d');
                
                // Set canvas size to character dimensions
                const characterWidth = 272;
                const characterHeight = 406;
                exportCanvas.width = characterWidth;
                exportCanvas.height = characterHeight;
                
                // White background
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, characterWidth, characterHeight);
                
                // Render each layer in order
                const layers = ['body', 'mouth', 'eyes', 'head', 'accessory'];
                
                for (const category of layers) {
                    const component = state.selectedComponents[category];
                    if (component && component.id !== 0) {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        
                        await new Promise((resolve, reject) => {
                            img.onload = () => {
                                // Get transforms
                                const position = state.positions[category];
                                const transforms = state.transforms[category];
                                
                                // Save context
                                ctx.save();
                                
                                // Apply transforms from center of canvas
                                const centerX = characterWidth / 2;
                                const centerY = characterHeight / 2;
                                
                                ctx.translate(centerX + position.x, centerY + position.y);
                                ctx.rotate((transforms.rotate * Math.PI) / 180);
                                ctx.scale(transforms.scale, transforms.scale);
                                
                                // Apply invert filter if needed
                                if (transforms.invert) {
                                    ctx.filter = 'invert(1)';
                                }
                                
                                // Draw image centered
                                ctx.drawImage(img, -img.width / 2, -img.height / 2);
                                
                                // Reset filter
                                ctx.filter = 'none';
                                
                                // Restore context
                                ctx.restore();
                                resolve();
                            };
                            img.onerror = reject;
                            img.src = component.path;
                        });
                    }
                }
                
                // Create PDF using jsPDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'in',
                    format: [8.5, 11]
                });
                
                // Convert canvas to image data
                const imgData = exportCanvas.toDataURL('image/png');
                
                // Calculate dimensions to fit character in printable area
                const pageWidth = 8.5;
                const pageHeight = 11;
                const margin = 0.75; // 0.75" margins on all sides
                const printableWidth = pageWidth - (margin * 2);
                const printableHeight = pageHeight - (margin * 2);
                
                // Calculate scaled dimensions maintaining aspect ratio (50% smaller)
                const aspectRatio = characterWidth / characterHeight;
                let imgWidth, imgHeight;
                
                if (aspectRatio > (printableWidth / printableHeight)) {
                    // Width-constrained
                    imgWidth = (printableWidth * 0.5); // 50% smaller
                    imgHeight = (printableWidth * 0.5) / aspectRatio;
                } else {
                    // Height-constrained
                    imgHeight = (printableHeight * 0.5); // 50% smaller
                    imgWidth = (printableHeight * 0.5) * aspectRatio;
                }
                
                // Center the image on the page
                const x = (pageWidth - imgWidth) / 2;
                const y = (pageHeight - imgHeight) / 2;
                
                // Add the character image to PDF
                pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
                
                // Generate filename with timestamp
                const now = new Date();
                const timestamp = now.toISOString().slice(0, 19).replace(/[-:T]/g, '').slice(0, 14);
                const filename = `character_${timestamp}.pdf`;
                
                // Save the PDF
                pdf.save(filename);
                
                // Restore original background
                canvas.style.backgroundColor = originalBg;
                
                // Clear the generating notification and show success
                const container = document.getElementById('notificationContainer');
                container.innerHTML = '';
                showNotification('PDF exported successfully!', 'success');
                
            } catch (error) {
                console.error('Export failed:', error);
                // Clear any existing notifications
                const container = document.getElementById('notificationContainer');
                container.innerHTML = '';
                showNotification('Export failed. Please try again.', 'error');
            }
        };

        // Reset all components and settings
        function resetCharacter() {
            showConfirmation(
                'Reset Character',
                'Reset all changes and start over? This will clear your current character but won\'t affect saved characters.',
                () => {
                    // Reset to initial state with body-1
                    state.selectedComponents = {
                        body: {
                            id: 1,
                            path: './assets/body/body-1.png'
                        },
                        mouth: null,
                        eyes: null,
                        head: null,
                        accessory: null
                    };
                    
                    // Reset positions
                    state.positions = {
                        body: { x: -1, y: 0 },
                        mouth: { x: 0, y: 4 },
                        eyes: { x: 0, y: -4 },
                        head: { x: 0, y: -16 },
                        accessory: { x: 0, y: 16 }
                    };
                    
                    // Reset transforms
                    state.transforms = {
                        body: { rotate: 0, scale: 1, invert: false },
                        mouth: { rotate: 0, scale: 1, invert: false },
                        eyes: { rotate: 0, scale: 1, invert: false },
                        head: { rotate: 0, scale: 1, invert: false },
                        accessory: { rotate: 0, scale: 1, invert: false }
                    };
                    
                    // Reset background
                    state.backgroundColor = '#ffffff';
                    document.getElementById('characterCanvas').style.backgroundColor = '#ffffff';
                    document.getElementById('backgroundColorInput').value = '#ffffff';
                    
                    // Reset UI
                    state.selectedForMoving = null;
                    hideMovementOverlay();
                    
                    // Update display
                    updateDisplay();
                    updateExportButton();
                    populateSelectors();
                    
                    showNotification('Character reset successfully!', 'success');
                }
            );
        }

        // Change background color
        function changeBackgroundColor(color) {
            state.backgroundColor = color;
            document.getElementById('characterCanvas').style.backgroundColor = color;
        }

        // Continuous movement state
        let continuousMovement = {
            interval: null,
            category: null,
            direction: null
        };

        // Start continuous movement
        function startContinuousMove(category, direction) {
            // Prevent default to avoid unwanted behaviors
            event.preventDefault();
            
            // Stop any existing movement
            stopContinuousMove();
            
            // Immediate first move
            moveComponent(category, direction);
            
            // Set up continuous movement
            continuousMovement.category = category;
            continuousMovement.direction = direction;
            continuousMovement.interval = setInterval(() => {
                moveComponent(category, direction);
            }, 100); // Move every 100ms for smooth movement
        }

        // Stop continuous movement
        function stopContinuousMove() {
            if (continuousMovement.interval) {
                clearInterval(continuousMovement.interval);
                continuousMovement.interval = null;
                continuousMovement.category = null;
                continuousMovement.direction = null;
            }
        }

        // Rotate component
        function rotateComponent(category, degrees) {
            state.transforms[category].rotate = degrees;
            document.getElementById(category + 'RotateValue').textContent = degrees + '°';
            updateDisplay();
        }

        // Scale component
        function scaleComponent(category, scale) {
            state.transforms[category].scale = parseFloat(scale);
            document.getElementById(category + 'ScaleValue').textContent = scale + 'x';
            updateDisplay();
        }

        // Invert component colors
        function invertComponent(category, invert) {
            state.transforms[category].invert = invert;
            updateDisplay();
        }

        // Show movement overlay for a specific component
        function showMovementOverlay(category) {
            // Hide all overlays first
            hideMovementOverlay();
            
            // Show the specific overlay
            const overlay = document.getElementById(category + 'Overlay');
            if (overlay) {
                overlay.classList.remove('hidden');
                state.selectedForMoving = category;
                
                // Update controls with current values
                const transforms = state.transforms[category];
                const rotateSlider = document.getElementById(category + 'Rotate');
                const scaleSlider = document.getElementById(category + 'Scale');
                const invertCheckbox = document.getElementById(category + 'Invert');
                const rotateValue = document.getElementById(category + 'RotateValue');
                const scaleValue = document.getElementById(category + 'ScaleValue');
                
                if (rotateSlider) {
                    rotateSlider.value = transforms.rotate;
                    rotateValue.textContent = transforms.rotate + '°';
                }
                if (scaleSlider) {
                    scaleSlider.value = transforms.scale;
                    scaleValue.textContent = transforms.scale + 'x';
                }
                if (invertCheckbox) {
                    invertCheckbox.checked = transforms.invert;
                }
            }
        }

        // Hide all movement overlays
        function hideMovementOverlay() {
            ['head', 'eyes', 'mouth', 'accessory'].forEach(category => {
                const overlay = document.getElementById(category + 'Overlay');
                if (overlay) {
                    overlay.classList.add('hidden');
                }
            });
            state.selectedForMoving = null;
        }

        // Move component
        function moveComponent(category, direction) {
            const position = state.positions[category];
            const moveDistance = 5;
            const maxX = 100, maxY = 150;

            switch(direction) {
                case 'up': position.y = Math.max(position.y - moveDistance, -maxY); break;
                case 'down': position.y = Math.min(position.y + moveDistance, maxY); break;
                case 'left': position.x = Math.max(position.x - moveDistance, -maxX); break;
                case 'right': position.x = Math.min(position.x + moveDistance, maxX); break;
            }

            updateDisplay();
        }

        // Remove component
        function removeComponent(category) {
            if (category === 'body') return;
            
            selectComponent(category, 0);
            hideMovementOverlay();
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Close modal when clicking overlay
            document.getElementById('modalOverlay').onclick = function(e) {
                if (e.target === this) {
                    hideModal();
                }
            };

            const backgroundBtn = document.getElementById('backgroundBtn');
            if (backgroundBtn) {
                backgroundBtn.onclick = function() {
                    const picker = document.getElementById('backgroundPicker');
                    if (picker) {
                        picker.classList.toggle('hidden');
                    }
                };
            }

            const closeBackgroundPicker = document.getElementById('closeBackgroundPicker');
            if (closeBackgroundPicker) {
                closeBackgroundPicker.onclick = function() {
                    const picker = document.getElementById('backgroundPicker');
                    if (picker) {
                        picker.classList.add('hidden');
                    }
                };
            }

            const backgroundColorInput = document.getElementById('backgroundColorInput');
            if (backgroundColorInput) {
                backgroundColorInput.onchange = function() {
                    changeBackgroundColor(this.value);
                };
            }

            const saveBtn = document.getElementById('saveBtn');
            if (saveBtn) {
                saveBtn.onclick = async function() {
                    // Find first empty slot or ask user to pick one
                    const emptySlot = state.savedCharacters.findIndex(slot => slot === null);
                    if (emptySlot !== -1) {
                        await saveCharacter(emptySlot);
                    } else {
                        showNotification('All slots full! Use the hover controls on saved characters to overwrite a slot.', 'warning');
                    }
                };
            }

            const loadBtn = document.getElementById('loadBtn');
            if (loadBtn) {
                loadBtn.onclick = function() {
                    const popup = document.getElementById('loadCharacterPopup');
                    if (popup) {
                        if (popup.classList.contains('hidden')) {
                            showLoadPopup();
                        } else {
                            popup.classList.add('hidden');
                        }
                    }
                };
            }

            const closeLoadPopup = document.getElementById('closeLoadPopup');
            if (closeLoadPopup) {
                closeLoadPopup.onclick = function() {
                    document.getElementById('loadCharacterPopup').classList.add('hidden');
                };
            }

            const resetBtn = document.getElementById('resetBtn');
            if (resetBtn) {
                resetBtn.onclick = function() {
                    resetCharacter();
                };
            }

            const bodyBtn = document.getElementById('bodyBtn');
            if (bodyBtn) {
                bodyBtn.onclick = function() {
                    const selector = document.getElementById('bodySelector');
                    if (selector) {
                        selector.classList.toggle('hidden');
                    }
                };
            }

            const closeBodySelector = document.getElementById('closeBodySelector');
            if (closeBodySelector) {
                closeBodySelector.onclick = function() {
                    const bodySelector = document.getElementById('bodySelector');
                    if (bodySelector) {
                        bodySelector.classList.add('hidden');
                    }
                };
            }

            const exportBtn = document.getElementById('exportBtn');
            if (exportBtn) {
                exportBtn.onclick = exportToPDF;
            }

            // Initialize saved characters
            loadCharactersFromStorage();
            updateSavedCharactersDisplay();
            
            // Initialize with body-1 loaded
            populateSelectors();
            updateDisplay();
            updateExportButton();

            console.log('Character Creator loaded successfully!');
        });
