import matplotlib.pyplot as plt; plt.rcdefaults()
import numpy as np
import matplotlib.pyplot as plt
import math
import os
f = ''
if os.path.exists('dishPredictions.txt'):
	f = open('dishPredictions.txt')
else:
	f = open('categoryPredictions.txt')
lines = f.readlines()
performance = []
ob = []
for i in lines:
	rest = i.split('(')[0]
	score = i.split('(')[1]
	score = score.strip('score = ') 
	score = float(score.split(')')[0])
	performance.append(score*100)
	ob.append(rest)
objects = tuple(ob)
y_pos = np.arange(len(objects))

plt.bar(y_pos, performance, align='center', alpha=0.5)
plt.xticks(y_pos, objects)
plt.ylabel('Confidence')
plt.title('Predictions')
plt.show()
