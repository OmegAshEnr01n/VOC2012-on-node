# -*- coding: utf-8 -*-
"""
Created on Mon Mar  4 11:41:00 2019

@author: Shobhit
"""

#################### IMPORT #################

import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from PIL import Image
from torch.utils.data import Dataset, DataLoader
import os
import pandas as pd
from torchvision import transforms, models
import copy
import time
import numpy as np
import matplotlib.pyplot as plt
import pickle
import os.path as osp
import sys

#############################################

############ GLOBAL VARIABLES ###############

class globals(): # yet to be implemented
    def __init__(self):
        self.vars = {}
    def setter(self, var, dat):
        self.vars[var] = dat
    def getter(self, var):
        return self.vars[var]
G = globals()
#G.setter('working_directory', 'D:/Files/Term 7/Deep Learning/small Project/VOC2012/')
G.setter('working_directory', sys.argv[1])
G.setter('valid', 'val')
G.setter('train','train')
G.setter('_VERBOSE', False)
G.setter('num_epochs', 25)
G.setter('batch_size', 100)
G.setter('_SAVEMODEL', True)



#############################################



######### DEFINING LOSS & DATASET ##########

device = torch.device('cpu')



#############################################

########## SETTING PARAMETERS TO BE TRAINED #

model = models.resnet18(pretrained=True)
model.avgpool = torch.nn.AdaptiveAvgPool2d((1, 1))
model.fc = nn.Sequential(
  nn.Linear(512, 1000),
  nn.Linear(1000,20)

)
print('--- resnet ---\n')
for name, child in model.named_children():
    if name in ['layer4', 'fc']:
        print(name + ' is unfrozen')
        for param in child.parameters():
            param.requires_grad = True
    else:
        print(name + ' is frozen')
        for param in child.parameters():
            param.requires_grad = False
print('\n--- ------ ---')
for name, child in model.named_children():

    if G.getter('_VERBOSE'): print(name)
    for param in child.parameters():
        if G.getter('_VERBOSE'): print(param.requires_grad)

model.load_state_dict(torch.load(sys.argv[1]))
model.to(device)
model.eval()

#############################################
#print(sys.argv[2]) image file
input = transforms.Compose([
                transforms.RandomResizedCrop(500),
                transforms.ToTensor()
            ])(Image.open(sys.argv[2]).convert('RGB'))
input = input.view(1,3,500,500)
outputs = torch.sigmoid(model(input))
sum = 0
for i in outputs[0]:
    sum += i
class_names = [
            'aeroplane',
            'bicycle',
            'bird',
            'boat',
            'bottle',
            'bus',
            'car',
            'cat',
            'chair',
            'cow',
            'diningtable',
            'dog',
            'horse',
            'motorbike',
            'person',
            'pottedplant',
            'sheep',
            'sofa',
            'train',
            'tvmonitor'
        ]
s2 = 0
with open(osp(sys.argv[2])+'_res.txt','a') as the_file:
    for i, cl in enumerate(class_names):
        the_file.write(cl + ' ' + str(outputs[0,i].item()/sum.item())+'\n')
        s2 += outputs[0,i].item()/sum.item()
print('s2 shoulde be 1 ',s2)
