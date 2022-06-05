// ToDo

class NN{
    frame(inp){ // []
        
        
        
        
        
        var out = [0, inp[5] - inp[1]];
        for(var i = 0; i < out.length; i++){
            if(out[i] < -1){
                out[i] = -1;
            }
            if(out[i] > 1){
                out[i] = 1;
            }
        }
        
        
        return out; // [acc, dir]
    }
    
    sigm(value, min, max){
        //https://www.baeldung.com/cs/normalizing-inputs-artificial-neural-network
        return (value - min) / (max - min) * (1-(-1)) - 1;
    }
    
}