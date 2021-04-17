'use strict';

module.exports = parseParams;
parseParams.parseOne = parseOne
parseParams.parseComment = parseComment
parseParams.parseDef = parseDef

function parseParams(script){
    let lines = script.split('\n').map(l=>l.trim())

    lines = lines.map((l,i)=>{
    	return {code:l, line:i+1, group: l[0] == '/' && !lines[i+1]}
    }).filter(l=>l.code)

    let i = 0, line, next, lineNum
    while(i<lines.length){
        line = lines[i].code.trim()
        i++
        if(line.length>12 && line.substring(line.length-13) == '//jscadparams') break;
    }

    let groupIndex = 1
    const defs = []

    while(i<lines.length){
        line = lines[i].code
        lineNum = lines[i].line
        next = lines[i+1] ? lines[i+1].code : ''
        if(line[0] === '}') break

        if(line[0] === '/'){
            if(lines[i].group || next.indexOf('/') !== -1){
                // group
                const def = parseComment(line, lineNum)
                let name = '_group_' +(groupIndex++)
                let caption = def.caption

                const idx = caption.lastIndexOf(':')
                if(idx !== -1){
                    name = caption.substring(idx+1).trim()
                    caption = caption.substring(0,idx).trim()
                }
                defs.push({name, type: 'group', caption})
                
            }else if(next){
                defs.push(parseOne(line,next, lineNum, lines[i+1].line))
                i++
            }
        }else{
            const idx = line.indexOf('/')
            if(idx === -1){
                const def = parseDef(line, lineNum)
                def.caption = def.name
                defs.push(def)
            }else{
                defs.push(parseOne(
                    line.substring(idx).trim(),
                    line.substring(0,idx).trim(),
                    lineNum,lineNum
                ))
            }
        }
        i++
    }

    return defs
}

function parseOne(comment, code, line1, line2){
    const {caption, options} = parseComment(comment, line1)
    let def = {caption, ...parseDef(code, line2)}
    if(options){
        def = {...def, ...options}
        if(def.type === 'checkbox' && def.hasOwnProperty('initial')) def.checked = true
    }

    return def;
}

function parseComment(comment, line){
    const prefix = comment.substring(0,2)
    if(prefix === '//') comment = comment.substring(2)
    if(prefix === '/*') comment = comment.substring(2, comment.length-2)
    
    comment = comment.trim()

    const ret = {}
    const idx = comment.indexOf('{')
    if(idx !== -1){
    	try{
	        ret.options = eval('('+comment.substring(idx)+')')
    	}catch(e){
    		console.log('Error in line '+line);
    		console.log(comment);
    		throw e
    	}
        comment = comment.substring(0,idx).trim()
    }
    
    ret.caption = comment

    return ret
}

function parseDef(code, line){
    if(code[code.length-1] == ',') code = code.substring(0,code.length-1)
    let idx = code.indexOf('=')

    if(idx == -1) idx = code.indexOf(':')

    if(idx == -1){
        return {name:code, type:'text'}
    }else{
        let initial = code.substring(idx+1).trim()
        
        const ret = {type:'text', name:code.substring(0,idx)}

        if(initial === 'true' || initial === 'false'){
            ret.type = 'checkbox'
            ret.checked = initial === 'true'

        }else if(/^[0-9]+$/.test(initial)){
            ret.type = 'int'
            ret.initial = parseFloat(initial)

        }else if(/^[0-9]+\.[0-9]+$/.test(initial)){
            ret.type = 'number'
            ret.initial = parseFloat(initial)
        }else{
            try {
                ret.initial = eval(initial)
            } catch (e) {
	    		console.log('Error in line '+line);
	    		console.log(code);
                console.log('problem evaluating inital value:', initial)
                throw e
            }
        }

        return ret
    }
}
