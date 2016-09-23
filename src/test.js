const _ = require('lodash')

const d = {"VDE":{"shares":9.8824,"price":95.22},"VEA":{"shares":100.19630000000001,"price":38.78},"VWO":{"shares":114.395,"price":37.96},"VHT":{"price":64.73,"shares":5.6987},"VGT":{"shares":15.8783,"price":109.49},"VNQ":{"price":62.63,"shares":10.6858},"VTI":{"shares":21.7895,"price":107.33},"ILF":{"shares":16.7237,"price":32.77},"PSCE":{"shares":8.9695,"price":30.72},"GNR":{"shares":11.9398,"price":45.11},"GNAT":{"shares":20.819,"price":17.13},"EPI":{"price":19.26,"shares":25.7841},"PRHSX":{"price":40.58,"shares":18},"VAW":{"shares":9,"price":102.42}}

console.log(_.map(d, element => element.shares * element.price).reduce((previous, current) => previous + current))