# Group Calculator App

The Group Calculator App features two main window containers: one for the calculator and its buttons and another for memory storage. On smaller screens, the memory storage window is hidden by default but can be revealed by clicking the "≡" icon, positioning it as the top layer.

![image](docs/group-calc-01.jpg)

In addition to standard calculator functionality, this app provides the ability to store calculations, including individual numbers. As you input numbers and operators, a save icon appears. By clicking this icon, the entire calculation is saved into an array with each number and operator stored separately.

Upon saving, a new object is created and stored in the app's local storage. Subsequently, a new HTML container is populated with the calculation numbers, operators, and a header in the calculator storage window. The header utilizes a general naming convention "calc_$," followed by the count of items. Clicking on the header activates the renaming function, allowing you to edit the name. After hitting enter or focusing out of the text, the calculation object and HTML are updated, and the local storage object is saved. The original "calc_$" name remains as the object key to preserve sorting.

![image](docs/group-calc-02-B.jpg)


Each number in the calculator item container has three dots next to it, serving as comments for better tracking. Like the header, you can change the dots to text by clicking on them, activating the renaming function. After hitting enter or focusing out, the object and HTML window are repopulated, and the local storage object is saved.

![image](docs/group-calc-02-A.jpg)

If a mistake is made in the calculation or numbers change over time, you can edit the stored calculation numbers. The function not only makes the number editable but also recalculates the entire container, updating the final sum in the background.

![image](docs/group-calc-02-C.jpg)

The Add button next to the sum number allows you to add a new number to the calculation array with the + operator. This new number can be edited like others, triggering recalculation and updating the stored object and HTML representation.

![image](docs/group-calc-02-D.jpg)

When removing a calculation with the X button next to the header, the function filters out the calculation object from the global calculator memory object, removes it, and updates the count for consistent naming.

![image](docs/group-calc-02-E.jpg)

Storage calculation items serve as a base for subsequent calculations. Clicking in the remaining area of the item container copies the sum number to your current calculator display. Close the storage window, add operators and numbers, or revisit the storage to select a different calculation. For instance, combine expense and income calculations to determine the remaining sum.

![](docs/group-calc.gif)
